import {Link} from 'react-router-dom'

const Start = () => {
    return (
        <div>
            <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1658744796948-b11ae1b52f3f?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full'>
                <img className='w-16 ml-8' src="https://www.edigitalagency.com.au/wp-content/uploads/Uber-logo-white-png-900x313.png" />
                <div className='bg-white pb-5 py-5 px-4'>
                    <h2 className='text-3xl font-bold'>Get Started with uber</h2>
                    <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
                </div>

            </div>
        </div>
    )
}

export default Start