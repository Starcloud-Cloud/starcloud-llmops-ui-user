import ApplicationAnalysis from 'views/template/applicationAnalysis';
const AppAnalysis = ({ appUid }: { appUid: string }) => {
    return (
        <>
            <ApplicationAnalysis appUid={appUid} />
        </>
    );
};
export default AppAnalysis;
