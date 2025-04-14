import { uploadFiles, readFiles } from "@directus/sdk";
import { defineTool } from "../utils/define-tool.js";
import * as z from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { Directus } from "../directus.js";



export const createGenericUploadFileTool = () => {
    return defineTool("upload-file", {
        description: "Upload a file to Directus.",
        inputSchema: z.object({
            files: z.array(z.object({
                file: z.instanceof(File).describe("The file to upload"),
                properties: z.record(z.string(), z.string()).optional().describe("Properties for this specific file")
            })).describe("Array of files to upload with their properties"),
            title: z.string().optional().describe("Optional global title for the files"),
            folder: z.string().optional().describe("Optional folder ID to place the files in"),
        }),
        handler: async (directus: Directus, query: any): Promise<CallToolResult> => {
            try {
                const { files, ...globalMetadata } = query;

                const formData = new FormData();

                // Add global metadata if provided
                if (Object.keys(globalMetadata).length > 0) {
                    Object.entries(globalMetadata).forEach(([key, value]) => {
                        formData.append(key, value as string);
                    });
                }

                // Add each file and its properties to the FormData
                files.forEach((fileObj: any, index: number) => {
                    const { file, properties } = fileObj;

                    // Add file-specific properties if provided
                    if (properties && Object.keys(properties).length > 0) {
                        Object.entries(properties).forEach(([key, value]) => {
                            formData.append(`file_${index + 1}_${key}`, String(value));
                        });
                    }

                    // Add the file
                    formData.append('file', file);
                });

                // Use the SDK's uploadFiles method
                const result = await directus.request(uploadFiles(formData));

                return { content: [{ type: "text", text: JSON.stringify(result) }] };
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: `Error: ${error?.message || "Unknown error"}`,
                                wholeError: error,
                            }),
                        },
                    ],
                };
            }
        },
    });
};

export const createFileFromUrlTool = () => {
    return defineTool("create-file-from-url", {
        description: "Create a file from a URL.",
        inputSchema: z.object({
            url: z.string().describe("The URL of the file to create"),
            filename: z.string().optional().describe("Optional custom filename for the file"),
        }),
        handler: async (directus: Directus, query: any): Promise<CallToolResult> => {
            try {
                const { url, filename } = query;

                // Fetch the file from URL
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch file from URL: ${response.status} ${response.statusText}`);
                }

                // Get the MIME type from the Content-Type header
                const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

                // Get a reasonable filename from either the provided filename, URL, or Content-Disposition header
                let derivedFilename = filename;
                if (!derivedFilename) {
                    // Try to get filename from Content-Disposition header
                    const contentDisposition = response.headers.get('Content-Disposition');
                    if (contentDisposition) {
                        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                        if (filenameMatch && filenameMatch[1]) {
                            derivedFilename = filenameMatch[1].replace(/['"]/g, '');
                        }
                    }

                    // If still no filename, extract from URL
                    if (!derivedFilename) {
                        derivedFilename = url.split('/').pop() || 'file';
                        // Remove URL parameters if any
                        derivedFilename = derivedFilename.split('?')[0];
                    }
                }

                // Get the blob with the correct MIME type
                const blob = await response.blob();
                const fileObj = new File([blob], derivedFilename, { type: contentType });

                // Create FormData and upload
                const formData = new FormData();
                formData.append('file', fileObj);

                const result = await directus.request(uploadFiles(formData));
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            data: result,
                            mimeType: contentType,
                            filename: derivedFilename
                        })
                    }]
                };
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: `Error: ${error?.message || "Unknown error"}`,
                                wholeError: error,
                            }),
                        },
                    ],
                };
            }
        },
    });
};
export const createGenericDownloadFileTool = () => {
    return defineTool("download-file", {
        description: "Download a file from Directus.",
        inputSchema: z.object({
            id: z.string().optional().describe("The ID of the file to download"),
            filter: z.record(z.string(), z.any()).optional().describe("Filter criteria for fetching files"),
            limit: z.number().optional().describe("Maximum number of files to return"),
            offset: z.number().optional().describe("Offset for pagination"),
            sort: z.string().optional().describe("Field to sort by (prefix with - for descending)"),
        }),
        handler: async (directus: Directus, query: any): Promise<CallToolResult> => {
            try {
                const { id, ...params } = query;

                let result;

                if (id) {
                    // If an ID is provided, get a specific file
                    result = await directus.request(readFiles(id));
                    // Wrap in the data array structure to match Directus format
                    result = { data: [result], meta: {} };
                } else {
                    // Otherwise, get files based on filter/params
                    result = await directus.request(readFiles(params));
                }

                return { content: [{ type: "text", text: JSON.stringify(result) }] };
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: `Error: ${error?.message || "Unknown error"}`,
                                wholeError: error,
                            }),
                        },
                    ],
                };
            }
        },
    });
};
