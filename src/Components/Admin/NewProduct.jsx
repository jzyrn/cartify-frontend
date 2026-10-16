import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'

import MetaData from '../Layout/MetaData'
import { AdminLayout, PageHeader, primaryBtnSx, fieldSx, cardSx, GREEN, GOLD } from './AdminUI'
import { newProduct, clearErrors } from '../../actions/productActions'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'

const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
]

const NewProduct = () => {
    const dispatch = useDispatch()
    const { loading, error, success } = useSelector(state => state.newProduct)

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState(0)
    const [seller, setSeller] = useState('')
    const [images, setImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    let navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.set('name', name)
        formData.set('price', price)
        formData.set('description', description)
        formData.set('category', category)
        formData.set('stock', stock)
        formData.set('seller', seller)

        images.forEach(image => {
            formData.append('images', image)
        })

        dispatch(newProduct(formData))
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([])
        setImages([])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }

        if (success) {
            navigate('/admin/products')
            toast.success('Product created successfully', { position: 'bottom-right' })
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [error, dispatch, navigate, success])

    return (
        <>
            <MetaData title={'New Product'} />
            <AdminLayout>
                <PageHeader title="New Product" subtitle="Add a product to your store" />

                <Paper
                    variant="outlined"
                    component="form"
                    onSubmit={submitHandler}
                    encType="multipart/form-data"
                    sx={{ ...cardSx, maxWidth: 760, width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}
                >
                    <TextField id="name_field" label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={fieldSx} />

                    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                        <TextField id="price_field" label="Price (₱)" value={price} onChange={(e) => setPrice(e.target.value)} sx={fieldSx} />
                        <TextField id="stock_field" label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} sx={fieldSx} />
                    </Box>

                    <TextField
                        id="description_field"
                        label="Description"
                        multiline
                        minRows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        sx={fieldSx}
                    />

                    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                        <TextField
                            id="category_field"
                            label="Category"
                            select
                            SelectProps={{ native: true }}
                            InputLabelProps={{ shrink: true }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            sx={fieldSx}
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </TextField>
                        <TextField id="seller_field" label="Seller Name" value={seller} onChange={(e) => setSeller(e.target.value)} sx={fieldSx} />
                    </Box>

                    <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: GREEN, mb: 1 }}>Images</Typography>
                        <Button
                            component="label"
                            variant="outlined"
                            sx={{ textTransform: 'none', borderColor: GREEN, color: GREEN, '&:hover': { borderColor: GOLD, bgcolor: '#f7eecb' } }}
                        >
                            Choose Images
                            <input type="file" name="images" id="customFile" hidden multiple onChange={onChange} />
                        </Button>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                            {imagesPreview.map(img => (
                                <Box
                                    key={img}
                                    component="img"
                                    src={img}
                                    alt="Images Preview"
                                    sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 2, border: '1px solid #e3e9e5' }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Button type="submit" fullWidth size="large" disableElevation disabled={loading ? true : false} sx={primaryBtnSx}>
                        Create
                    </Button>
                </Paper>
            </AdminLayout>
        </>
    )
}

export default NewProduct