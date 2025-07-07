import React, { useRef, useState } from 'react'
import api from '../../services/api'

interface AssetUploaderProps {
  onSuccess?: () => void
}

const AssetUploader: React.FC<AssetUploaderProps> = ({ onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setSuccess(false)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folderType', 'GENERAL')
      // Upload para /upload
      await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess(true)
      if (onSuccess) onSuccess()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setError('Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ margin: '16px 0' }}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span style={{ marginLeft: 8 }}>Enviando...</span>}
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
      {success && (
        <div style={{ color: 'green', marginTop: 4 }}>
          Upload realizado com sucesso!
        </div>
      )}
    </div>
  )
}

export default AssetUploader
