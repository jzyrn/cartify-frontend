import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'

import MetaData from '../Layout/MetaData'
import { AdminLayout, PageHeader, PageLoader, IconAction, StatusPill, primaryBtnSx, cardSx, dataGridSx, gridProps, idCellSx } from './AdminUI'
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'

const ProductsList = () => {
    const dispatch = useDispatch()
    const { loading, error, products } = useSelector(state => state.products)
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        dispatch(getAdminProducts())

        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }

        if (deleteError) {
            toast.error(deleteError, { position: 'bottom-right' })
            dispatch(clearErrors())
        }

        if (isDeleted) {
            toast.success('Product deleted successfully', { position: 'bottom-right' })
            dispatch({ type: DELETE_PRODUCT_RESET })
        }
    }, [error, deleteError])

    const columns = [
        {
            field: 'id',
            headerName: 'Product ID',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => <Box component="span" sx={idCellSx}>{params.value}</Box>,
        },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
        { field: 'price', headerName: 'Price', width: 120, align: 'right', headerAlign: 'right' },
        {
            field: 'stock',
            headerName: 'Stock',
            width: 130,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) =>
                params.value === 0 ? <StatusPill label="Out of stock" tone="danger" /> : params.value,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconAction to={`/admin/product/${params.id}`} icon="fa-pencil" title="Edit" />
                    <IconAction onClick={() => deleteProductHandler(params.id)} icon="fa-trash" title="Delete" tone="danger" />
                </Box>
            ),
        },
    ]

    const rows = products.map(product => ({
        id: product._id,
        name: product.name,
        price: `₱${product.price}`,
        stock: product.stock,
    }))

    return (
        <>
            <MetaData title={'All Products'} />
            <AdminLayout>
                <PageHeader
                    title="All Products"
                    subtitle={`${products.length} product${products.length === 1 ? '' : 's'} in your store`}
                    action={<Button component={Link} to="/admin/product" disableElevation sx={primaryBtnSx}>+ New Product</Button>}
                />
                <Paper variant="outlined" sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <PageLoader />
                    ) : (
                        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} sx={dataGridSx} {...gridProps} />
                    )}
                </Paper>
            </AdminLayout>
        </>
    )
}

export default ProductsList