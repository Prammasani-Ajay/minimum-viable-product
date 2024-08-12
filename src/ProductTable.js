import React, { useEffect, useState } from 'react';
import './ProductTable.css'; // Import CSS file

const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
};

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBranchData = async () => {
            const branchUrls = ['/api/branch1.json', '/api/branch2.json', '/api/branch3.json'];
            const dataPromises = branchUrls.map(url => fetch(url).then(response => response.json()));
            const allBranchData = await Promise.all(dataPromises);
            mergeProductData(allBranchData);
        };

        const mergeProductData = (branches) => {
            const productMap = {};

            branches.forEach(branch => {
                branch.products.forEach(product => {
                    if (!productMap[product.name]) {
                        productMap[product.name] = 0;
                    }
                    productMap[product.name] += product.unitPrice;
                });
            });

            const mergedProducts = Object.entries(productMap).map(([name, unitPrice]) => ({
                name,
                unitPrice,
            }));

            // Sort products alphabetically
            mergedProducts.sort((a, b) => a.name.localeCompare(b.name));
            setProducts(mergedProducts);
            setFilteredProducts(mergedProducts);
        };

        fetchBranchData();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const totalRevenue = filteredProducts.reduce((total, product) => total + product.unitPrice, 0);

    return (
        <div className="product-table">
            <div className="search-container">
                <label htmlFor="searchInput">Search Product:</label>
                <input 
                    type="text" 
                    id="searchInput" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Enter product name" 
                />
            </div>
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
                            <td>{formatNumber(product.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="total-revenue">
                Total Revenue: {formatNumber(totalRevenue)}
            </div>
        </div>
    );
};

export default ProductTable;
