import React from "react";
import Apple from '../img/footer.Apple.png'
import Ideal from '../img/footer.Ideal.png'
import Mastercard from '../img/footer.Mastercard.png'
import PostNL from '../img/footer.PostNL.png'
import Thuiswinkel from '../img/footer.Thuiswinkel.png'
import Visa from '../img/footer.Visa.png'
import customerService from '../img/footer.CustomerService.png'



function Footer(props) {

    return (
        <footer className="footer">
            <div className="footerTop">
                <img src={customerService} alt='customer service' className="customerServiceImage"/>
                <div>
                <div><b>Do you have a question?</b></div>
                <div>We're glad to help you on our customer service page</div>
                </div>
                <form className="emailMarketing">
                    <label>Get notified for the latest giveaways and discounts!</label>
                    <input placeholder="enter your email here"/>
                    <button className="emailMarketingSubmit"><b>Submit email</b></button>
                </form>
            </div>
            <div className="footerBottom">
                <div className="customerService">
                <b>Customer Service</b>
                <div>Exchange and return</div>
                <div>Warrant and repairs</div>
                <div>Order status</div>
                <div>Login</div>
                </div>

                <div className="makeMoneyWithUs">
                <b>Make money with us</b>
                <div>Start selling on the Ecom Marketplace</div>
                <div>Affiliate marketing</div>
                <div>Advertising</div>
                </div>

                <div className="ourPhysicalStore">
                <b>Our physical stores</b>
                <div>Amsterdam</div>
                <div>Rotterdam</div>
                <div>Berlin</div>
                <div>Brussel</div>
                <div>Paris</div>
                </div>

                <div className="getToKnowEcom">
                    <b>About Ecom</b>
                    <div>Our categories</div>
                    <div>Our mission</div>
                    <div>Ecom app</div>
                    <div>Career opportunities</div>
                </div>
            </div>
            <div className="awards">
                <img src={Ideal} />
                <img src={Mastercard} />
                <img src={Visa} />
                <img src={Apple} />
                <img src={Thuiswinkel} />
                <img src={PostNL} />
            </div>
            <div className="bottomOfPage">
                <ul className="bottomOfPageTOS">
                    <li>Terms and Conditions |</li>
                    <li>Privacy |</li>
                    <li>Cookies |</li>
                    <li>English (EN)</li>
                </ul>
                <div className="bottomOfPageCompany">© 2023 - 2023 - Ecom LLC</div>
            </div>
        </footer>
    )
}

export default Footer;