import React, { useEffect, useState } from 'react'
import { checkHeading, replaceHeading } from '../helper'

const Answers = ({ ans, index, totalResult, type }) => {
    const [heading, setHeading] = useState(false)
    const [answer, setAnswer] = useState(ans)

    useEffect(() => {
        if (checkHeading(ans)) {
            setHeading(true)
            setAnswer(replaceHeading(ans))
        }
    }, [ans])

    return (
        <div>
            {type === 'q' ? (
                <span className="font-bold text-white text-lg">{answer}</span>
            ) : heading ? (
                <span className="pt-2 text-xl font-bold block">{answer}</span>
            ) : (
                <span className="pl-2">{answer}</span>
            )}
        </div>
    )
}

export default Answers
