-- SCRIPT PARA CORRIGIR PERMISSÕES DE STORAGE - UNIAFY
-- Este script garante que o bucket 'Identidade Visual' exista e que as permissões de upload estejam corretas.

-- 1. Garante que o bucket 'Identidade Visual' exista e seja público
INSERT INTO storage.buckets (id, name, public)
VALUES ('Identidade Visual', 'Identidade Visual', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Limpa políticas existentes para evitar duplicidade
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Master Upload" ON storage.objects;
DROP POLICY IF EXISTS "Master Update" ON storage.objects;
DROP POLICY IF EXISTS "Master Delete" ON storage.objects;

-- 3. Cria novas políticas de acesso total para o bucket 'Identidade Visual'
-- Estas políticas garantem que usuários autenticados possam Ver, Inserir, Atualizar e Deletar
-- O DELETE é essencial para a substituição automática de imagens (branding-uploader).

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO authenticated, anon
USING (bucket_id = 'Identidade Visual');

CREATE POLICY "Master Upload" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'Identidade Visual');

CREATE POLICY "Master Update" 
ON storage.objects FOR UPDATE 
TO authenticated
WITH CHECK (bucket_id = 'Identidade Visual');

CREATE POLICY "Master Delete" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'Identidade Visual');

-- Habilitar RLS se não estiver
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

SELECT 'Permissões de Storage configuradas com sucesso! Substituição de imagens ativada.' as status;
