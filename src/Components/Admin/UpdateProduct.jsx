import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'

import MetaData from '../Layout/MetaData'
import { AdminLayout, PageHeader, primaryBtnSx, fieldSx, cardSx, GREEN, GOLD } from './AdminUI'
import { updateProduct, getProductDetails, clearErrors } from '../../actions/productActions'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'

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

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState(0)
    const [seller, setSeller] = useState('')
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    let { id } = useParams()
    let navigate = useNavigate()

    const errMsg = (message = '') => toast.error(message, { position: 'bottom-right' })
    const successMsg = (message = '') => toast.success(message, { position: 'bottom-right' })

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
        dispatch(updateProduct(product._id, formData))
    }

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
        } else {
            setName(product.name)
            setPrice(product.price)
            setDescription(product.description)
            setCategory(product.category)
            setSeller(product.seller)
            setStock(product.stock)
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