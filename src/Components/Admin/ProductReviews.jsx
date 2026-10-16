import React, { useState, useEffect } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Swal from 'sweetalert2'
import axios from 'axios'

import MetaData from '../Layout/MetaData'
import { AdminLayout, PageHeader, IconAction, primaryBtnSx, fieldSx, cardSx, dataGridSx, gridProps, idCellSx } from './AdminUI'
import { getUser, getToken, errMsg } from '../Utils/helpers'

const ProductReviews = () => {
    const [productId, setProductId] = useState('')
    const [error, setError] = useState('')
    const [listReviews, setListReviews] = useState([])
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)
    const [user, setUser] = useState(getUser())

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const getProductReviews = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/reviews?id=${id}`, config)
            setListReviews(data.reviews)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const deleteReview = async (id, productId) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API}/reviews?id=${id}&productId=${productId}`, config)
            setIsDeleted(data.success)
        } catch (error) {
            setDeleteError(error.response.data.message)
        }
    }

    const deleteReviewHandler = (id) => {
        Swal.fire({
            title: 'Delete Review',
            icon: 'info',
            text: 'Do you want to delete this review',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#17332a',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReview(id, productId)
            }
        })
    }

    useEffect(() => {
        if (error) {
            setError('')
        }

        if (deleteError) {
            setDeleteError('')
        }

        if (productId !== '') {
            getProductReviews(productId)
        }

        if (isDeleted) {
            errMsg('Review deleted successfully', 'success')
            setIsDeleted(false)
        }
    }, [error, productId, isDeleted, deleteError])

    const submitHandler = (e) => {
        e.preventDefault()
        getProductReviews(productId)
    }

    const columns = [
        {
            field: 'id',
            headerName: 'Review ID',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => <Box component="span" sx={idCellSx}>{params.value}</Box>,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 110,
            renderCell: (params) => (
                <Box component="span" sx={{ color: '#8c7418', fontWeight: 700 }}>{params.value} ★</Box>
            ),
        },
        { field: 'comment', headerName: 'Comment', flex: 2, minWidth: 220 },
        { field: 'user', headerName: 'User', flex: 1, minWidth: 140 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconAction onClick={() => deleteReviewHandler(params.id)} icon="fa-trash" title="Delete" tone="danger" />
            ),
        },
    ]

    const rows = listReviews.map(review => ({
        id: review._id,
        comment: review.comment,
        rating: review.rating,
        user: review.user,
    }))

    return (
        <>
            <MetaData title={'Product Reviews'} />
            <AdminLayout>
                <PageHeader title="Product Reviews" subtitle="Search a product by its ID to see and manage its reviews" />

                <Paper variant="outlined" sx={cardSx}>
                    <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
                        <TextField
                            id="productId_field"
                            label="Product ID"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            sx={{ flex: 1, minWidth: 240, ...fieldSx }}
                        />
                        <Button type="submit" disableElevation sx={{ ...primaryBtnSx, height: 56 }}>
                            Search
                        </Button>
                    </Box>
                </Paper>

                {listReviews && listReviews.length > 0 ? (
                    <Paper variant="outlined" sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
                        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} sx={dataGridSx} {...gridProps} />
                    </Paper>
                ) : (
                    <Paper variant="outlined" sx={{ ...cardSx, textAlign: 'center', py: 6 }}>
                        <Typography color="text.secondary">No reviews to show.</Typography>
                    </Paper>
                )}
            </AdminLayout>
        </>
    )
}

export default ProductReviews