import React from "react";

const filters = {
    categoryElectronics: {
        RenderSubcategory: true,
        RenderBrands: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: false,
        RenderScreenSize: false,
        RenderChipset: false,
        RenderMemorySize: false,
        RenderAuthor:false
    },
    categoryBooks : {
        RenderSubcategory: true,
        RenderBrands: false,
        RenderPublisher: false,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: false,
        RenderScreenSize: false,
        RenderChipset: false,
        RenderMemorySize: false,
        RenderAuthor: false
    },

    subcategoryTelevisions: {
        RenderSubcategory: false,
        RenderBrands: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: true,
        RenderScreenSize: true,
        RenderChipset: false,
        RenderMemorySize: false,
        RenderAuthor:false
    },

    subcategoryPhones: {
        RenderSubcategory: false,
        RenderBrands: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: true,
        RenderScreenSize: false,
        RenderChipset: true,
        RenderMemorySize: false,
        RenderAuthor:false
    },

    subcategoryGameConsole: {
        RenderSubcategory: false,
        RenderBrands: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: true,
        RenderScreenSize: false,
        RenderChipset: false,
        RenderMemorySize: true,
        RenderAuthor:false
    },

    subcategoryHistory : {
        RenderSubcategory: false,
        RenderBrands: false,
        RenderPublisher: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: true,
        RenderScreenSize: false,
        RenderChipset: false,
        RenderMemorySize: false,
        RenderAuthor:true
    },
    
    subcategoryScience : {
        RenderSubcategory: false,
        RenderBrands: false,
        RenderPublisher: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: true,
        RenderScreenSize: false,
        RenderChipset: false,
        RenderMemorySize: false,
        RenderAuthor:true
    },

    subcategoryBiography : {
        RenderSubcategory: false,
        RenderBrands: false,
        RenderPublisher: true,
        RenderReviewStars: true,
        RenderDeliveryOption: true,
        RenderPrice: true,
        RenderScreenSize: false,
        RenderChipset: false,
        RenderMemorySize: false,
        RenderAuthor:true
    },


}



export default filters;