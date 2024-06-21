import React, { useEffect } from 'react'
import './Popular.css'

import Item from '../Item/Item'


function Popular() {
    const [popularinwoman, setPopularinWoman] = React.useState([])
    useEffect(()=>{
                fetch ('http://localhost:4000/popularinwoman').then((res)=>res.json()).then((data)=>setPopularinWoman(data))

    },[])
    return (
        <div className="popular">
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular-item">
                {
                    popularinwoman.map((item, index) => {
                        return <Item key={index} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                    })
                    // .filter((item, index) => item.category==="woman")
                }
            </div>

        </div>
    )
}

export default Popular