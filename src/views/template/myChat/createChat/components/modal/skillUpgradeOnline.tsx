import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export const SkillUpgradeOnline = ({ handleClose, open }: { handleClose: () => void; open: boolean }) => {
    const navigate = useNavigate();
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '530px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="升级"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <div className="flex justify-center flex-col items-center">
                        <div className="flex items-center justify-center flex-col">
                            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="150">
                                <path
                                    d="M512 810.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z"
                                    p-id="13104"
                                    fill="#707070"
                                ></path>
                                <path
                                    d="M530.773333 469.333333l-81.066666-80.64-104.96-104.106666-66.133334-66.133334-77.653333-78.08a42.666667 42.666667 0 0 0-60.586667 60.586667l58.88 58.453333 62.293334 62.293334 95.146666 95.573333 66.133334 65.706667 116.906666 116.906666 119.04 119.466667 164.266667 164.266667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667zM926.72 338.346667A594.346667 594.346667 0 0 0 512 170.666667a601.6 601.6 0 0 0-189.44 31.146666l69.12 69.12a507.306667 507.306667 0 0 1 476.16 128 42.666667 42.666667 0 0 0 29.44 11.946667 42.666667 42.666667 0 0 0 30.72-13.226667 42.666667 42.666667 0 0 0-1.28-59.306666zM162.986667 283.733333a610.986667 610.986667 0 0 0-65.706667 54.613334 42.666667 42.666667 0 0 0 58.88 61.44 558.506667 558.506667 0 0 1 68.266667-55.04zM725.333333 560.64a42.666667 42.666667 0 0 0 30.293334 12.8 42.666667 42.666667 0 0 0 30.72-72.106667A384 384 0 0 0 512 384h-6.826667l100.266667 100.266667A298.666667 298.666667 0 0 1 725.333333 560.64zM317.013333 437.76a375.466667 375.466667 0 0 0-81.066666 63.573333A42.666667 42.666667 0 0 0 298.666667 560.64a311.466667 311.466667 0 0 1 85.333333-60.16zM363.946667 657.066667a42.666667 42.666667 0 1 0 59.306666 61.44 130.56 130.56 0 0 1 163.84-10.666667l-107.52-107.52a213.333333 213.333333 0 0 0-115.626666 56.746667z"
                                    p-id="13105"
                                    fill="#707070"
                                ></path>
                            </svg>
                            <div className="text-sm text-[#152737] my-4">
                                该功能需要依赖联网功能，升级后，魔法AI可智能利用互联网，实时获取全网最新数据，提高精度和速度
                            </div>
                        </div>
                        <Button variant="contained" color={'secondary'} className="w-[200px]" onClick={() => navigate('/subscribe')}>
                            升级
                        </Button>
                    </div>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
