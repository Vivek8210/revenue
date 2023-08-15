import React, { useEffect, useState } from 'react'
import "../pages/revenueTable.css"
import data1 from "../api/branch1.json"
import data2 from "../api/branch2.json"
import data3 from "../api/branch3.json"
const RevenueTable = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchError, setSearchError] = useState(false)

    useEffect(() => {
        const allProducts = [data1, data2, data3].flatMap(allBranchData => allBranchData.products)
        console.log(allProducts)
        const productRevenue = allProducts.map(product => ({
            ...product,
            revenue: product.unitPrice * product.sold
        }))
        console.log("productRevenue", productRevenue)

        const mergedProducts = mergeProducts(productRevenue);
        setProducts(mergedProducts);
        setFilteredProducts(mergedProducts)
        console.log("mergedProducts", mergedProducts)
    }, [])



    useEffect(() => {
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(filter.toLowerCase())
        )

        const sorted = [...filtered].sort((a, b) => {
            const compare = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
            return sortOrder === 'asc' ? compare : -compare;
        });
        setFilteredProducts(sorted)

        const revenue = sorted.reduce((total, product) => total + product.revenue, 0);
        setTotalRevenue(revenue);
        setSearchError(filtered.length === 0)
    }, [filter, products, sortOrder])

    const handleSortToggle = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))
        console.log("hshd")
    }

    const mergeProducts = products => {
        const merged = [];
        const productMap = new Map()

        products.forEach(product => {
            const existingProduct = productMap.get(product.name)
            if (existingProduct) {
                existingProduct.revenue += product.revenue
            }
            else {
                productMap.set(product.name, { ...product });
            }
        });
        productMap.forEach(product => {
            merged.push(product)
        })
        return merged
    }
    const formatNumber = number => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(number)
    }
    return (
        <div className='main_container'>
            <div className='searh_wrapper'>
            <label htmlFor="">Search product here</label><br />
                <input
                    className='search_input'
                    type="search"
                    id="filter"
                   
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="sortOrder">Filter</label>
                <select name=""
                    id="sortOrder"
                    value={sortOrder}
                    onChange={handleSortToggle}

                >
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                </select>
                <p className='error_message'>{searchError ? "No matching products found" : ""}</p>
            </div>
            <div className='table_wrapper'>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (

                            <tr key={product.name}>
                                <td>{product.name}</td>
                                <td>{formatNumber(product.revenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Total</td>
                            <td>{formatNumber(totalRevenue)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default RevenueTable