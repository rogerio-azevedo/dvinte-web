import React, { useEffect, useState } from 'react'
import AssetUploader from '../../components/AssetUploader'
import api from '../../services/api'

interface Asset {
  id: number
  url: string
  original_name: string
  uploaded_at: string
}

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const fetchAssets = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<Asset[]>('/assets')
      setAssets(res.data)
    } catch {
      setError('Erro ao carregar assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleDelete = async (id: number, url: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta imagem?')) return
    try {
      await api.delete('/upload', { data: { url } })
      setAssets(assets => assets.filter(a => a.id !== id))
    } catch {
      alert('Erro ao deletar asset')
    }
  }

  const handleUploadSuccess = () => {
    fetchAssets()
  }

  const handleCopy = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Assets (Uploads Gerais)</h1>
      <AssetUploader onSuccess={handleUploadSuccess} />
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 24,
          background: '#fafafa',
        }}
      >
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Preview</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Nome</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>
              URL Pública
            </th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>
              Data de Upload
            </th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td
                style={{
                  textAlign: 'center',
                  padding: 8,
                  border: '1px solid #ddd',
                }}
              >
                <img
                  src={asset.url}
                  alt={asset.original_name}
                  style={{
                    maxWidth: 80,
                    maxHeight: 60,
                    objectFit: 'contain',
                    borderRadius: 4,
                  }}
                />
              </td>
              <td
                style={{ padding: 8, border: '1px solid #ddd', fontSize: 14 }}
              >
                {asset.original_name}
              </td>
              <td
                style={{ padding: 8, border: '1px solid #ddd', fontSize: 12 }}
              >
                <span style={{ wordBreak: 'break-all' }}>{asset.url}</span>
                <button
                  onClick={() => handleCopy(asset.url, asset.id)}
                  style={{
                    marginLeft: 8,
                    background: '#3498db',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '2px 8px',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  {copiedId === asset.id ? 'Copiado!' : 'Copiar'}
                </button>
              </td>
              <td
                style={{ padding: 8, border: '1px solid #ddd', fontSize: 12 }}
              >
                {new Date(asset.uploaded_at).toLocaleString('pt-BR')}
              </td>
              <td
                style={{
                  padding: 8,
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                <button
                  onClick={() => handleDelete(asset.id, asset.url)}
                  style={{
                    background: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AssetsPage
