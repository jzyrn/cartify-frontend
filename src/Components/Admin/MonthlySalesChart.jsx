import React, { useState, useEffect } from 'react'
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Box, CircularProgress, Typography } from '@mui/material'
import { getToken } from '../Utils/helpers'
import axios from 'axios'

const GREEN = '#17332a'
const GREEN_MID = '#2f6b55'
const GOLD = '#c9a227'

const short = (v) => (v >= 1000 ? `₱${v / 1000}k` : `₱${v}`)

export default function MonthlySalesChart() {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const monthlySales = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${getToken()}` } }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/sales-per-month`, config)
            setSales(data.salesPerMonth)
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load sales')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        monthlySales()
    }, [])

    if (loading || error || sales.length === 0) {
        return (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <CircularProgress size={28} sx={{ color: GREEN }} />
                ) : (
                    <Typography color="text.secondary" variant="body2">{error || 'No sales data yet.'}</Typography>
                )}
            </Box>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sales} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GREEN_MID} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={GREEN_MID} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e8eeea" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a73' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a73' }} tickFormatter={short} width={55} />
                <Tooltip
                    formatter={(v) => [`₱${Number(v).toLocaleString('en-PH')}`, 'Sales']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #e3e9e5', boxShadow: 'none' }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke={GREEN_MID}
                    strokeWidth={2.5}
                    fill="url(#salesFill)"
                    dot={false}
                    activeDot={{ r: 5, fill: GOLD, stroke: '#fff', strokeWidth: 2 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}