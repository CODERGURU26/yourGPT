import React, { useEffect, useState } from 'react'
import { checkHeading, replaceHeading } from '../helper'

const Answers = ({ ans, key }) => {
    const [heading, setHeading] = useState(false)
    const [answer , setAnswer] = useState(ans)

    useEffect(() => {
        if (checkHeading(ans)) {
            setHeading(true)
            setAnswer(replaceHeading(ans))
        }
    }, [])

    return (
        <div>
            {
                heading ? <span className='pt-2 text-xl font-bold block'>{answer}</span>
                    : <span className='pl-2'>{answer}</span>
            }
        </div>
    )
}

export default Answers