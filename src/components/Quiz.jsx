import { useEffect, useRef, useState } from "react"
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from "../api"
import { Box, Card, CardContent, CardHeader, CardMedia, LinearProgress, List, ListItemButton, Typography } from "@mui/material"
import { getFormattedTime } from "../helper"
import { useStateContext } from "../hooks/useStateContext"

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [questionIndex, setQuestionIndex] = useState(0)
    const [timeTaken, setTimeTaken] = useState(0)
    const { context, setContext } = useStateContext()

    const timer = useRef();      

    const startTimer = () => {
        if (timer.current == null) {
            timer.current = setInterval(() => {
                setTimeTaken(prevTime => prevTime + 1)
            }, 1000)
        }
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: [],
        })

        setTimeTaken(0)
        setQuestionIndex(0)
        const fetchQuestions = async () => {
            try {
                const res = await createAPIEndpoint(ENDPOINTS.questions).fetch()
                setQuestions(res.data)
                startTimer()
            } catch (error) {
                console.error(error)
            }
        }

        fetchQuestions()

        return () => {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }   
    }, [])

    const updateAnswer = (questionId, optionIndex) => {
        const selectedOptions = [...context.selectedOptions]

        selectedOptions.push({
            questionId,
            selected: optionIndex
        })

        if (questionIndex < 4) {
            setContext({ selectedOptions })
            setQuestionIndex(prevIdx => prevIdx + 1)
        } else {
            setContext({ selectedOptions, timeTaken })
        }
    }

    return (
        questions.length > 0 ? <Card sx={{ width: '640px', mx: 'auto', mt: '5rem', '& .MuiCardHeader-action': { m: '0', alignSelf: 'center' } }}>
            <CardHeader title={`Question ${questionIndex + 1} of 5`} action={<Typography>{getFormattedTime(timeTaken)}</Typography>}/>
            <Box>
                <LinearProgress variant="determinate" value={(questionIndex + 1) / 5 * 100} />
            </Box>

            {questions[questionIndex].imageName ? <CardMedia
                component="img"
                height="300"
                image={`${BASE_URL}Images/${questions[questionIndex].imageName}`}
                alt={questions[questionIndex].questionInWords}
            /> : null}

            <CardContent>
                <Typography variant="h6">{questions[questionIndex].questionInWords}</Typography>
                <List>
                    {questions[questionIndex].options.map((option, index) => (
                        <ListItemButton key={index} disableRipple onClick={() => updateAnswer(questions[questionIndex].id, index)}>
                            <div>{String.fromCharCode(65 + index)}. {option}</div>
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card> : null
    )
}

export default Quiz