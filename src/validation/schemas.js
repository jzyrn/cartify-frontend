import * as Yup from 'yup'

export const productSchema = Yup.object({
    name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Product name is required'),
    price: Yup.number().typeError('Price must be a number').min(0, 'Price cannot be negative').required('Price is required'),
    description: Yup.string().trim().min(10, 'Description must be at least 10 characters').required('Description is required'),
    category: Yup.string().required('Category is required'),
    stock: Yup.number().typeError('Stock must be a number').integer('Stock must be a whole number').min(0, 'Stock cannot be negative').required('Stock is required'),
    seller: Yup.string().trim().min(2, 'Seller name must be at least 2 characters').required('Seller name is required'),
})

export const loginSchema = Yup.object({
    email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export const profileSchema = Yup.object({
    name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
})
