import {
    Modal,
    IconButton,
    CardContent,
    Box,
    Divider,
    CardActions,
    Grid,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9)
];
const AddRuleModal = ({ open, handleClose }: { open: boolean; handleClose: (open: boolean) => void }) => {
    const [addOpen, setAddOpen] = useState(false);
    return (
        <Modal open={open} onClose={() => handleClose(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '80%',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
                }}
                headerSX={{ p: '16px !important' }}
                contentSX={{ p: '16px !important' }}
                title="新增规则"
                content={false}
                secondary={
                    <IconButton onClick={() => handleClose(false)}>
                        <Close fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '16px !important' }}>
                    <Box my={2} display="flex" justifyContent="right">
                        <Button onClick={() => setAddOpen(true)} size="small" color="secondary" variant="contained">
                            新增规则
                        </Button>
                    </Box>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Modal
                        open={addOpen}
                        onClose={() => setAddOpen(false)}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <MainCard
                            style={{
                                position: 'absolute',
                                width: '60%',
                                top: '10%',
                                left: '50%',
                                transform: 'translate(-50%, 0)'
                            }}
                            headerSX={{ p: '16px !important' }}
                            contentSX={{ p: '16px !important' }}
                            title="规则列表"
                            content={false}
                            secondary={
                                <IconButton onClick={() => setAddOpen(false)}>
                                    <Close fontSize="small" />
                                </IconButton>
                            }
                        >
                            <CardContent sx={{ p: '16px !important' }}>2222222</CardContent>
                            <Divider sx={{ mt: 2 }} />
                            <CardActions sx={{ p: 2 }}>
                                <Grid container justifyContent="flex-end">
                                    <Button variant="contained" color="secondary">
                                        保存
                                    </Button>
                                </Grid>
                            </CardActions>
                        </MainCard>
                    </Modal>
                </CardContent>
                <Divider sx={{ mt: 2 }} />
                <CardActions sx={{ p: 2 }}>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
export default AddRuleModal;
