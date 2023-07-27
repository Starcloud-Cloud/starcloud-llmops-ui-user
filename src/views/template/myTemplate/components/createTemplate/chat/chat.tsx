import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { CardContent, Grid, IconButton, InputAdornment, OutlinedInput, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChartHistory from './ChartHistory';

export type IHistory = {
    type: number;
    text?: string;
    time?: string;
};

export const Chat = () => {
    const theme = useTheme();
    const scrollRef = React.useRef();

    const [user, setUser] = React.useState<any>({});
    const [data, setData] = React.useState<IHistory[]>([
        {
            type: 2,
            text: 'Hello, How can I help you?',
            time: '2023-09-02 10:30'
        },
        {
            type: 1,
            text: 'Hello, How can I help you?',
            time: '2023-09-02 10:30'
        }
    ]);
    const [message, setMessage] = React.useState('');

    React.useLayoutEffect(() => {
        if (scrollRef?.current) {
            // @ts-ignore
            scrollRef.current.scrollIntoView();
        }
    });

    // handle new message form
    const handleOnSend = () => {
        setMessage('');
        const newMessage = {
            type: 1,
            text: message,
            time: dayjs().format('YYYY-MM-DD HH:mm')
        };
        setData((prevState) => [...prevState, newMessage]);
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (event?.key !== 'Enter') {
            return;
        }
        handleOnSend();
    };

    return (
        <div className="bg-[#f4f6f8] rounded-md">
            <PerfectScrollbar style={{ width: '100%', height: 'calc(100vh - 440px)', overflowX: 'hidden', minHeight: 525 }}>
                <CardContent>
                    <ChartHistory theme={theme} user={user} data={data} />
                    {/* @ts-ignore */}
                    {/* <span ref={scrollRef} /> */}
                </CardContent>
            </PerfectScrollbar>
            <Grid container spacing={1} alignItems="center" className="px-[24px] pb-[24px]">
                <Grid item>
                    <IconButton size="large" aria-label="attachment file">
                        <AttachmentTwoToneIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12} sm zeroMinWidth>
                    <OutlinedInput
                        id="message-send"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleEnter}
                        placeholder="Type a Message"
                        endAdornment={
                            <>
                                <InputAdornment position="end">
                                    <IconButton disableRipple color="primary" onClick={handleOnSend} aria-label="send message">
                                        <SendTwoToneIcon />
                                    </IconButton>
                                </InputAdornment>
                                <InputAdornment position="end">
                                    <IconButton disableRipple color="primary" onClick={handleOnSend} aria-label="send message">
                                        <SendTwoToneIcon />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{ 'aria-label': 'weight' }}
                    />
                </Grid>
            </Grid>
        </div>
    );
};
