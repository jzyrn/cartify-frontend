import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'

import MetaData from '../Layout/MetaData'
import { AdminLayout, PageHeader, primaryBtnSx, fieldSx, cardSx, GREEN, GOLD } from './AdminUI'
import { updateProduct, getProductDetails, clearErrors } from '../../actions/productActions'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import { productSchema } from '../../validation/schemas'

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

const thumbSx = { width: 72, height: 72, objectFit: 'cover', borderRadius: 2, border: '1px solid #e3e9e5' }

const UpdateProduct = () => {
    const dispatch = useDispatch()
    const { error, product } = useSelector(state => state.productDetails)
    const { loading, error: updateError, isUpdated } = useSelector(state => state.product)

    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    let { id } = useParams()
    let navigate = useNavigate()

    const errMsg = (message = '') => toast.error(message, { position: 'bottom-right' })
    const successMsg = (message = '') => toast.success(message, { position: 'bottom-right' })

    const formik = useFormik({
        initialValues: {
            name: product?.name || '',
            price: product?.price ?? '',
            description: product?.description || '',
            category: product?.category || '',
            stock: product?.stock ?? '',
            seller: product?.seller || '',
        },
        enableReinitialize: true,
        validationSchema: productSchema,
        onSubmit: (values) => {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => formData.set(key, value))
        images.forEach(image => {
            formData.append('images', image)
        })
        dispatch(updateProduct(product._id, formData))
        },
    })

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([])
        setImages([])
        setOldImages([])
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
        if (product && product._id !== id) {
            dispatch(getProductDetails(id))
        } else if (product) {
            setOldImages(product.images)
        }
        if (error) {
            errMsg(error)
            dispatch(clearErrors())
        }
        if (updateError) {
            errMsg(updateError)
            dispatch(clearErrors())
        }
        if (isUpdated) {
            navigate('/admin/products')
            successMsg('Product updated successfully')
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }
    }, [error, updateError, product, id, isUpdated])

    return (
        <>
            <MetaData title={'Update Product'} />
            <AdminLayout>
                <PageHeader title="Update Product" subtitle="Edit the details of this product" />

                <Paper
                    variant="outlined"
                    component="form"
                    onSubmit={formik.handleSubmit}
                    encType="multipart/form-data"
                    sx={{ ...cardSx, maxWidth: 760, width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}
                >
                    <TextField id="name_field" label="Name" {...formik.getFieldProps('name')} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} fullWidth sx={fieldSx} />

                    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                        <TextField id="price_field" label="Price (₱)" type="number" {...formik.getFieldProps('price')} error={formik.touched.price && Boolean(formik.errors.price)} helperText={formik.touched.price && formik.errors.price} sx={fieldSx} />
                        <TextField id="stock_field" label="Stock" type="number" {...formik.getFieldProps('stock')} error={formik.touched.stock && Boolean(formik.errors.stock)} helperText={formik.touched.stock && formik.errors.stock} sx={fieldSx} />
                    </Box>

                    <TextField
                        id="description_field"
                        label="Description"
                        multiline
                        minRows={5}
                        {...formik.getFieldProps('description')}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
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
                            {...formik.getFieldProps('category')}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                            sx={fieldSx}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </TextField>
                        <TextField id="seller_field" label="Seller Name" {...formik.getFieldProps('seller')} error={formik.touched.seller && Boolean(formik.errors.seller)} helperText={formik.touched.seller && formik.errors.seller} sx={fieldSx} />
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
                            {oldImages && oldImages.map(img => (
                                <Box key={img.url || img} component="img" src={img.url} alt={img.url} sx={thumbSx} />
                            ))}
                            {imagesPreview.map(img => (
                                <Box key={img} component="img" src={img} alt="Images Preview" sx={thumbSx} />
                            ))}
                        </Box>
                    </Box>

                    <Button type="submit" fullWidth size="large" disableElevation disabled={loading ? true : false} sx={primaryBtnSx}>
                        Update
                    </Button>
                </Paper>
            </AdminLayout>
        </>
    )
}

export default UpdateProduct