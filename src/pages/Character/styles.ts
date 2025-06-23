import styled from 'styled-components'

interface ContainerProps {
  loading: number
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
`

export const TableContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: auto;

  .ant-table {
    background: white;
    border-radius: 4px;
  }

  .ant-table-thead > tr > th {
    text-align: center;
    font-weight: 600;
    background: #fafafa;
  }

  .ant-table-tbody > tr > td {
    text-align: center;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f5f5f5;
  }
`

export const Portrait = styled.div`
  height: 80px;
  width: 80px;
  display: block;
  margin: auto;

  img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #d9d9d9;
    transition: border-color 0.2s;

    &:hover {
      border-color: #1890ff;
    }
  }
`
