import React from 'react'
import './card.css'

const Card = ({ cardData }) => {
    const classBold = 'card-text fw-bold'
    const classNormal = 'card-text'
    return (
        <div className='col-lg-3 g-4 col-md-6 '>
            <div className="card bg-light text-dark rounded-3 price-card">
                <div className="card-body">
                    <h5 className="card-title text-center text-muted">{cardData.subName}</h5>
                    <h1 className='card-title text-center'>${cardData.price}<span className='fs-6'>/month</span></h1>
                    <hr />
                    <p className={cardData.users != 1 ? classBold : classNormal}><i className="bi bi-check"></i>&nbsp;{cardData.users === 1 ? 'Single User' : `${cardData.users} Users`}</p>
                    <p className="card-text"><i className="bi bi-check"></i>&nbsp;{cardData.storage}GB Storage</p>
                    {cardData.UnlimitedPublicProjects ?
                        <p className="card-text"><i className="bi bi-check"></i>&nbsp;Unlimited Public Projects</p> :
                        <p className="card-text text-muted"><i className="bi bi-x"></i>&nbsp;Unlimited Public Projects</p>
                    }

                    {
                        cardData.communityAccess ?
                            <p className="card-text"><i className="bi bi-check"></i>&nbsp;Community Access</p> :
                            <p className="card-text text-muted"><i className="bi bi-x"></i>&nbsp;Community Access</p>

                    }

                    {
                        cardData.UnlimitedPrivateProjects ?
                            <p className="card-text"><i className="bi bi-check"></i>&nbsp;Unlimited Private Projects</p> :
                            <p className="card-text text-muted"><i className="bi bi-x"></i>&nbsp;Unlimited Private Projects</p>

                    }

                    {
                        cardData.dedicatedPhoneSupport ?
                            <p className="card-text"><i className="bi bi-check"></i>&nbsp;Dedicated Phone Support</p> :
                            <p className="card-text text-muted"><i className="bi bi-x"></i>&nbsp;Dedicated Phone Support</p>

                    }

                    {
                        cardData.subName === 'PRO' ?
                            <p className="card-text"><i className="bi bi-check"></i>&nbsp;<span className='fw-bold'>Unlimited</span> Subdomains</p> :
                            cardData.freeSubDomain ?
                                <p className="card-text"><i className="bi bi-check"></i>&nbsp;Free Subdomain</p> :
                                <p className="card-text text-muted"><i className="bi bi-x"></i>&nbsp;Free Subdomain</p>

                    }

                    {
                        cardData.monthlyStatusReports ?
                            <p className="card-text"><i className="bi bi-check"></i>&nbsp;Monthly Status Reports</p> :
                            <p className="card-text text-muted"><i className="bi bi-x"></i>&nbsp;Monthly Status Reports</p>

                    }

                    <br />
                    <div className='d-flex justify-content-center '>
                        <a href="#" className="btn btn-primary rounded-pill w-100 p-3 select-btn">Button</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card