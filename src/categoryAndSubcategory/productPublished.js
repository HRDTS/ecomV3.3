import React, { useEffect } from "react";

function ProductPublished(props) {


    return(
        <div className="successfullyPublished">
            <h1 style={{color: 'green'}}>You have successfully published your product!</h1>
            <h2>Refresh your page and check out your product.</h2>
        </div>
    )
}

export default ProductPublished;