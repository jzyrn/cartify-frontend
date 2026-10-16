import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'

import MetaData from '../Layout/MetaData'
import { PageHeader, PageLoader, IconAction, StatusPill, primaryBtnSx, cardSx, dataGridSx, gridProps, idCellSx } from '../Admin/AdminUI'
import { myOrders, clearErrors } from '../../actions/orderActions'

const statusTone = (status = '') => {
    if (String(status).includes('Delivered')) return 'good'
    if (String(status).includes('Shipped')) return 'gold'
    return 'neutral'
}

const ListOrders = () => {
    const dispatch = useDispatch()
    const { loading, error, orders } = useSelector(state => state.myOrders)

    // fetch once when the page opens
    useEffect(() => {
        dispatch(myOrders())
    }, [dispatch])

    // show + clear errors (separate effect so it never re-triggers the fetch)
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
    }, [error, dispatch])

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => <Box component="span" sx={idCellSx}>{params.value}</Box>,
        },
        { field: 'numOfItems', headerName: 'Items', type: 'number', width: 100, align: 'right', headerAlign: 'right' },
        { field: 'amount', headerName: 'Amount', width: 140, align: 'right', headerAlign: 'right' },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => <StatusPill label={params.value} tone={statusTone(params.value)} />,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => <IconAction to={`/order/${params.id}`} icon="fa-eye" title="View order" />,
        },
    ]

    const rows = (orders || []).map(order => ({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `₱${order.totalPrice}`,
        status: order.orderStatus || '',
    }))

    return (
        <>
            <MetaData title={'My Orders'} />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <PageHeader title="My Orders" subtitle={`${rows.length} order${rows.length === 1 ? '' : 's'} so far`} />

                {loading ? (
                    <PageLoader />
                ) : rows.length === 0 ? (
                    <Paper variant="outlined" sx={{ ...cardSx, textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            You haven't placed any orders yet
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            When you do, they will show up here.
                        </Typography>
                        <Button component={Link} to="/" disableElevation sx={primaryBtnSx}>
                            Start shopping
                        </Button>
                    </Paper>
                ) : (
                    <Paper variant="outlined" sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
                        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} sx={dataGridSx} {...gridProps} />
                    </Paper>
                )}
            </Container>
        </>
    )
}

export default ListOrders