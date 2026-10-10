import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Loader from '../Layout/Loader'

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { isAuthenticated, loading, user } = useSelector(state => state.auth)

    if (loading) {
        return <Loader />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (isAdmin === true && user?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute