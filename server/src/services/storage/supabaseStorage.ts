import { supabase, BUCKET } from '../../db/supabase.js';

export async function uploadPDFToSupabase(
    buffer: Buffer,
    userId: string,
    originalName: string
) {
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
            contentType: 'application/pdf',
            upsert: false,
        });

    if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return path; // store this path in Prisma, not a public URL
}

export async function downloadPDFFromSupabase(path: string): Promise<Buffer> {
    const { data, error } = await supabase.storage.from(BUCKET).download(path);

    if (error || !data) {
        throw new Error(`Supabase download failed: ${error?.message}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export async function deletePDFFromSupabase(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
        console.warn(`[supabase] Failed to delete ${path}: ${error.message}`);
    }
}

export async function getSignedUrl(path: string, expiresInSeconds = 3600) {
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, expiresInSeconds);

    if (error || !data) {
        throw new Error(`Failed to create signed URL: ${error?.message}`);
    }

    return data.signedUrl;
}