import React from 'react'

const Loader = () => {
    return (
        <div className='min-h-screen flex items-center justify-center flex-col'>
            <img src="https://cdn.dribbble.com/userupload/23237805/file/original-b01f81713802bdc20e9ce2ba275aec43.gif" alt="Loading..." className='w-64 h-64' />
            <h1 className='text-center text-lg'>Please be patient.. We run on free servers :)</h1>
        </div>
    )
}

export default Loader