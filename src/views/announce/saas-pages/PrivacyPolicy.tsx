// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Container, Grid, Typography, Stack } from '@mui/material';

// project imports
import AppBar from 'ui-component/extended/AppBar';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import headerBackground from 'assets/images/landing/bg-header.jpg';
import { t } from 'hooks/web/useI18n';

const HeaderWrapper = styled('div')(({ theme }) => ({
    backgroundImage: `url(${headerBackground})`,
    backgroundSize: '100% 600px',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    textAlign: 'center',
    paddingTop: 30,
    [theme.breakpoints.down('md')]: {
        paddingTop: 0
    }
}));

// ============================|| SAAS PAGES - PRIVCY POLICY ||============================ //

const PrivacyPolicy = () => {
    console.log('announce');
    const theme = useTheme();

    return (
        <HeaderWrapper>
            <AppBar />
            <Container>
                <Grid container justifyContent="center" spacing={gridSpacing}>
                    <Grid item sm={10} md={7} sx={{ mt: { md: 12.5, xs: 2.5 }, mb: { md: 8, xs: 2.5 } }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h1"
                                    color="white"
                                    component="div"
                                    sx={{
                                        fontSize: '3.5rem',
                                        fontWeight: 900,
                                        lineHeight: 1.4,
                                        [theme.breakpoints.down('md')]: { fontSize: '1.8125rem', marginTop: '80px' }
                                    }}
                                >
                                    魔法笔记用户服务协议
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{ fontWeight: 400, lineHeight: 1.4, [theme.breakpoints.up('md')]: { my: 0, mx: 12.5 } }}
                                    color="white"
                                >
                                    更新于2023年6月31日
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard elevation={4} border={false} boxShadow shadow={4} sx={{ mb: 3 }}>
                            <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                <Typography variant="h4">{t('auth.policy.title1')}</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    欢迎使用由星河云海（杭州）网络技术有限公司及其关联方（以下简称“星河云海”或“我们”）合法拥有并运营的魔法笔记产品及服务。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    魔法笔记是一个基于人工智能的营销内容创作平台。魔法笔记相关网站、服务、产品、应用程序与内容，在《魔法笔记用户服务协议》（以下简称“本协议”）中统称为“本服务”。个人用户、授权用户统称为“您”。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    本协议为您与我们之间的有效协议，规定了您下载、安装、注册、登录、使用（统称“使用”）本服务时须遵循的条款与条件。您使用本服务即表示您确认，您具备履行本协议的完整的民事权利能力和民事行为能力；否则，您不应使用本服务。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    请您在使用本服务之前，仔细阅读并充分理解本协议。本协议的免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。若您是未满18周岁的自然人，请您在法定监护人陪同下仔细阅读并充分理解本协议，并征得法定监护人的同意后使用本服务。
                                </Typography>
                                <Typography variant="h4">【个人用户、授权用户与客户】</Typography>
                                <Typography variant="h4">
                                    您使用本服务时，可能有两种不同身份，包括个人用户及授权用户。相关定义如下：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、 个人用户，以个人身份注册和使用本服务的自然人。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、 授权用户，指被客户邀请加入，并使用本服务的自然人，包括团队创建人、企业管理员。经客户指定，代客户配置本服务、行使后台管理权限的自然人称为企业管理员；最初代表客户创建团队的，称为团队创建人。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、 客户，指通过授权自然人注册本服务帐号，搭建组织架构并享有管理权限的法人或其他组织，客户可以邀请个人加入其组织成为其授权用户。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    个人用户可于注册个人身份帐号后，为个人用途使用本服务。个人用户登录后，可于法律与本协议允许范围内，自行决定上传、查阅或删除用户内容或个人信息。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    客户可通过发送（或指示我们发送）二维码、邀请链接，或其他方式邀请授权用户。您同意，除了邀请您使用本服务的客户的工作人员之外，您不会与任何人分享该二维码、邀请链接或其他授权方式下提供的信息。您亦同意，为使您及客户的其他授权用户能够享受本服务的部分功能，该客户可能向我们及客户的其他授权用户提供您的信息。该客户收集、使用、共享您信息的行为应遵守相关法律法规要求，我们仅根据客户要求处理您的信息，且不对该客户的相关行为承担法律责任。授权用户的个人信息及用户内容的相关处理请您详细查阅。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    作为授权用户，客户将对您的授权用户身份及基于该身份的相关权益进行管理，包括但不限于加入、删除以及调整权限和限制服务内容等，您保证在遵守本服务相关规范的同时，按照该客户的授权范围和规范使用本服务，如您丧失授权用户身份，我们有权根据客户的指示将基于该身份的服务内容一并删除或转移。请您知悉，客户应独自负责将所有与您使用本服务有关的客户政策和惯例，以及可能影响、限制您使用本服务或访问客户数据的设置向您进行充分说明与告知，我们不就此承担任何责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    针对授权用户使用本服务的情况，若本协议与我们与客户所订立的其他协议规定有所冲突，则以其他协议为准。若您是以授权用户或外包厂商身份使用本服务的，您理解本服务为客户使用的职场工具性质，并非个人消费使用性质。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    如果您代表客户注册本服务，您承诺已获得客户的充分授权，授权您代表其接受、履行本协议的全部内容。在此情况下，客户将对您使用本服务产生的各项行为在法律和财务方面承担责任。若客户就使用本服务与星河云海另行达成其他协议，且本协议与其他协议内容有冲突的，相关内容以另行达成的其他协议为准。本协议未提及的内容，以其他协议约定为准。
                                </Typography>
                                <Typography variant="h4">【关于帐号】</Typography>
                                <Typography variant="h4">帐号注册与开通</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、您可以通过本服务提供的注册界面或我们提供的其他软件注册帐号使用本服务。您有权选择合法且符合本服务要求的字符组合作为自己帐号的名称，并可对帐号自行设置符合安全要求的密码。您设置的帐号、密码是您登录并以注册用户身份使用本服务及我们提供的其他软件及相关服务的凭证。请务必维护并按时更新您的个人信息以及其他提供给我们的数据，确保数据完整且符合现况。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、您也可以选择通过授权使用本服务支持的实名注册的第三方软件或平台帐号、客户分配的内部帐号或我们允许的其他方式登录并使用本服务，但第三方软件或平台对此有限制或禁止的除外。当您以前述已有帐号登录使用的，应保证相应帐号已进行实名注册登记，并同样适用本协议中的相关条款。您将授权我们获取您在第三方平台或客户内部帐号注册的公开信息（姓名、头像以及您授权的其他信息），用于与本服务帐号绑定，使您可以直接登录并使用本服务。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、客户通过授权自然人（即创建人）开通本服务后，可以设置不同后台管理系统管理权限的企业管理员，企业管理员可以有一人或多人，具体可由客户及已有的管理员自行设定。企业管理员可在本服务上传、管理及维护授权用户的通讯录信息或其他相关信息，并可以邀请成员加入，实现即时沟通、协同办公、组织管理、架构调整等各类功能。客户获取前述信息的行为应由客户自行向授权用户告知并获得授权用户同意，我们不就客户行为承担责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、您理解并承诺，您设置的帐号不得违反国家法律法规及本服务相关规则，您的帐号名称、头像和简介等用于使用本服务的信息及其他向我们提供的信息中不得出现违法或不良信息，未经他人许可不得使用他人名义（包括但不限于通过冒用他人姓名、名称、字号、头像等足以让人引起混淆的方式）注册帐号，不得恶意注册帐号。您在帐号使用过程中需遵守相关法律法规，不得实施任何侵害国家利益、损害其他公民合法权益或者有害社会良好道德风尚的行为。我们有权对您提交的注册信息进行审核，对于违反本条款约定的注册信息，我们有权视情况采取不予注册、屏蔽或删除违法违规内容、不经通知暂停使用、冻结帐号、注销或收回帐号等措施，您应自行承担因此导致不能使用帐号或与之相关的服务与功能所造成的损失。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    5、 部分服务无需帐号即可访问，您同意使用此类服务时，亦遵守本协议约定。
                                </Typography>
                                <Typography variant="h4">帐号使用与安全</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、您了解并同意，本服务帐号所有权及有关权益均归我们所有，完成首次登录后您将获得该帐号的使用权。您的帐号仅限本人使用，未经我们书面同意，禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、您有责任维护帐号、密码的安全性与保密性，在任何情况下不向他人透露，若发现他人未经许可使用您的帐号或发生其他任何安全漏洞问题时，您应当立即通知我们。在丢失帐号或遗忘密码时，您可遵照我们提供的申诉途径及时申诉请求找回帐号或密码。您理解并认可，密码找回机制仅识别申诉单上所填资料与系统记录资料是否一致，而无法识别申诉人是否为帐号真正有权使用者。如有涉嫌借款、投融资、理财或其他涉及财产的网络信息、账户密码、广告或推广等信息的，请您谨慎对待并自行进行判断。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、您充分了解并同意，您应为自己帐号下的一切行为负责，包括该帐号所发表的任何内容以及由此产生的任何后果。您应对使用本服务时接触到的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。我们无法且不会对您因前述风险而导致的任何损失或损害承担责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、在您完成帐号的注册、登录并进行合理和必要的身份验证后，如您是个人用户，您可随时浏览、修改自己提交的个人身份信息；如您是授权用户，您需要通过客户的管理员修改已经提交的身份信息。您理解并同意，出于安全性和身份识别（如帐号或密码找回申诉服务等）的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    5、 您理解并同意，为了充分使用帐号资源，如您在注册后未及时进行初次登录使用或连续超过12个月未登录帐号并使用，我们有权收回您的帐号。如您的帐号被收回，您可能无法通过您此前持有的帐号登录并使用本服务，您该帐号下的使用记录将无法恢复。在收回您的帐号之前，我们将以适当的方式向您作出提示，如您在收到相关提示后一定期限内仍未登录、使用帐号，我们将进行帐号收回。
                                </Typography>
                                <Typography variant="h4">
                                    帐号冻结您的帐号在如下情况可能被冻结或被限制全部或部分权限、功能（如帐号被限制资金转出或领取红包等功能）：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、违反国家法律、法规、政策、法律文书的规定的
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、国家有权机关（包括但不限于法院、检察机关、公安机关等）要求进行冻结的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、基于本服务运行和交易安全的需要，如您发生或可能发生破坏或试图破坏我们及关联公司公平交易环境或正常交易秩序的，或任何使用含有我们及关联公司名称、品牌且对他人有误导嫌疑或任何使用某种中英文(全称或简称)、数字、域名等意图表示或映射与我们及关联公司具有某种关联的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、您遭到他人投诉，且对方已经提供了相关证据，而您未按照我们的要求提供相反证据的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    5、我们根据合理分析判断您的帐号操作、收益、兑换等存在异常的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    6、帐号归属存在争议的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    7、违反本协议、规则以及其他相关协议的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    8、我们合理判断，您发生与如上行为性质相同或产生如上类似风险的其他情况的。
                                </Typography>
                                <Typography variant="h4">帐号注销</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在需要终止使用本服务时，根据您的不同身份，您可以通过下述方式申请注销您的帐号，但您仍应对您在注销帐号前使用本服务期间的行为承担相应责任：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、若您是个人用户，您可以在手机端点击个人头像，选择系统设置-帐号与安全-注销个人身份在线提交注销申请，我们会在完成个人身份、安全状态、设备信息、侵权投诉等方面的合理和必要的验证后协助您注销帐号，并将您帐号下的所有数据删除或匿名化处理，但依据法律法规需保留的的除外。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、若您是授权用户，该帐号即成为企业用户办公工具的一部分，您可以向您所在的企业或组织提交退出团队申请并注销帐号，由管理员处理。除此之外，您所在企业或组织的管理员若在本服务中将您设置为离职状态的，您使用的该帐号将会被注销。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、在您的帐号被注销前，我们将验证您的个人身份、安全状态、设备信息等信息，并在确认您的帐号钱包无余额后帮助您完成注销。您知悉并理解，注销帐号的行为是不可逆的行为，在您的帐号被注销后，我们将删除有关您的相关信息或进行匿名化处理，但法律法规另有规定或根据客户需要就企业控制的数据另行处理的除外。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、我们保留在您违反适用法律法规规定或违反本协议的情况下冻结、注销您的帐号并删除或匿名化处理您所存储的数据、文件的权利，且无需为此向您承担任何责任，由此带来的因您使用本服务产生的全部数据、信息等被清空、丢失等的损失，您应自行承担。
                                </Typography>
                                <Typography variant="h4">【您访问与使用本服务之权利】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在本协议约定的条款与条件范围内，我们授予您访问、使用本服务，并访问星河云海内容（详见第9条定义）的权利，星河云海内容仅可通过使用本服务访问。此授权为非独家、有限、不可转让、不可分许可且可撤销的授权。星河云海保留一切与本服务、星河云海内容相关的权利。若未事先取得我们（或我们的授权方）书面同意，您不得为任何目的以任何形式对本服务及星河云海内容进行包括但不限于复制、改编、重制、分发、传送、广播、展示、销售、授权，垂直搜索、镜像或其他未经授权的访问与使用。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们可能不时提供试用服务或功能，并向不特定客户或受邀请客户提供。您理解并同意，试用服务将按“现状”和“当前可用”的形式提供。对试用服务在法律允许范围内我们可能仅提供有限的或在一些情形下不会提供技术支持，我们也可能在不另行通知的情况下随时更改或者停止提供试用服务；您理解我们没有义务最终发布或发售任何试用产品、服务或将其与现有产品组合为您提供服务。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您理解并认可，本协议中所描述的功能可能仅对部分用户提供，或以特定的方式（如有偿付费）提供，您在访问和使用本服务时能够实际享受的服务以我们实际向您提供的内容为准。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    为提升用户体验、满足用户新需求、保证产品及服务的安全性和稳定性，或基于法律和监管要求，我们将不定期进行软件更新或改变（包括但不限于修改、升级、迁移、开发新功能、变更、暂停或取消某种功能），对本服务、系统、软件等进行检修、维护，本服务可能因前述原因在合理时间内中断或暂停，您同意，我们无需为此向您承担责任。在可能的情况下，我们将尽可能以合理的方式就前述事宜通知您。若因不可抗力、基础运营商等原因导致的非常规维护，我们会在该等事件发生后尽可能以合理方式通知您。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们可能在您使用本服务的过程中向您发送、展示广告或其他信息（包括商业或非商业信息），您应当谨慎判断广告等信息的真实性、可靠性。
                                </Typography>
                                <Typography variant="h4">【用户使用规范】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    行为要求您应正确配置和使用本服务，并自行采取一定的安全性措施，对您的内容进行保护和备份。您声明并保证您接入本服务的算法、模型、数据、产品、服务的安全性、稳定性、有效性，不包含任何其他软件程序，不存在病毒、蠕虫、木马和其他有害的计算机的代码、文件、脚本和程序，也不存在任何一项恶意软件特征，不会对我们和/或其关联方的相关系统造成损害，亦不会对我们和/或其关联方或其他第三方数据造成损害。由于您的内容引起的安全漏洞，包括但不限于病毒、木马、蠕虫或其他有害程序，或由于您未按照本协议约定使用服务而引起的安全漏洞，由您自行负责并承担责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您使用本服务不得：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、使用未经我们授权或许可的任何插件、外挂、系统、程序或第三方工具对本服务的正常运行进行干扰、破坏、修改或施加其他影响，包括但不限于使用自动化脚本等方式收集来自本服务的信息或与本服务互动、大量占用本服务系统或者网络带宽资源，给本服务系统或者使用本服务的其他用户的网络、服务器、产品或应用带来严重负荷，影响系统通畅。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、利用或针对本服务进行任何危害计算机网络安全的行为，包括但不限于：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1）非法侵入网络、干扰网络正常功能、窃取网络数据等危害网络安全的活动
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2） 提供专门用于从事侵入网络、干扰网络正常功能及防护措施、窃取网络数据等危害网络安全活动的程序、工具；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3）明知他人从事危害网络安全的活动的，为其提供技术支持、广告推广、支付结算等帮助；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4）使用未经许可的数据或进入未经许可的服务器/帐号；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    5）未经允许进入公众计算机网络或者他人计算机系统并删除、修改、增加存储信息；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    6）未经许可，企图探查、扫描、测试本服务系统或网络的弱点或其它实施破坏网络安全的行为；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    7）企图干涉、破坏本服务系统或网站的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    8）伪造TCP/IP数据包名称或部分名称；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    9）复制、模仿、修改、翻译、改编、出借、出售、转许可、在信息网络上传播或转让相关服务，或对本服务及相关服务进行反向工程、反向汇编、编译或者以其他方式尝试发现本服务的源代码；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    10）恶意注册星河云海帐号，包括但不限于频繁、批量注册帐号；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    11）违反法律、法规、协议、我们的相关规则及侵犯他人合法权益的其他行为。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、将本服务用于广告目的或进行任何商业推销或复制、经销、许可、转让、租赁或出售本服务的全部或部分。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、绕过我们可能用于阻止或限制访问服务的任何措施。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    5、将本服务或其任何部分纳入任何其他程序或产品
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    6、冒充他人或其他组织机构，或对您自己的身份或您与他人或其他组织机构的关系作出虚假或不当的陈述，包括给人以您上传、发布、传播、散布或提供的任何内容是出自本服务的印象。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    8、超出正常好友或用户之间信息沟通、交流等目的（包括但不限于为发送广告、垃圾、骚扰或违法违规等信息的目的），通过自己添加或诱导他人添加等任何方式使自己与其他用户形成好友关系。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    9、将本服务用于操作核设施、飞机导航和通讯系统、空中交通管制、生命支持系统、武器系统等类似的高风险场景或某些特定目的。如果您将本服务用于高风险场景而导致人员伤亡、财产损失或环境破坏，星河云海不承担责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    10、进行违反法律法规、本规范、星河云海的相关规则及侵犯他人合法权益的其他行为。
                                </Typography>
                                <Typography variant="h4">信息内容规范</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、您使用本服务开发、制作、利用、上传、评论、发布、传播、存储、分享的内容（包括但不限于上传至本服务的未公开分享的内容）应自觉遵守相关法律法规，否则我们有权立即采取相应处理措施。您不得利用本服务制作、复制、存储、发表、传播下列信息：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、反对宪法确定的基本原则的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、危害国家安全，泄露国家秘密的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、颠覆国家政权，推翻社会主义制度，煽动分裂国家，破坏国家统一的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    5、损害国家荣誉和利益的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    6、宣扬恐怖主义、极端主义的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    7、宣扬民族仇恨、民族歧视，破坏民族团结的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    8、煽动地域歧视、地域仇恨的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    9、破坏国家宗教政策，宣扬邪教和封建迷信的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    10、编造、散布谣言、虚假信息，扰乱经济秩序和社会秩序、破坏社会稳定的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    11、散布、传播淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    12、危害网络安全、利用网络从事危害国家安全、荣誉和利益的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    13、侮辱或者诽谤他人，侵害他人合法权益的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    14、对他人进行暴力恐吓、威胁，实施人肉搜索的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    15、歪曲、丑化、亵渎、否定英雄烈士事迹和精神，以侮辱、诽谤或者其他方式侵害英雄烈士的姓名、肖像、名誉、荣誉的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    16、散布污言秽语，损害社会公序良俗的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    17、侵犯他人隐私权、名誉权、肖像权、知识产权等合法权益内容的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    18、任何未经我们或接收方同意的广告、招揽推广材料、“垃圾邮件”、“垃圾短信”、“连锁信”、“传销”或任何其它被禁止的招揽形式内容；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    19、侵害未成年人合法权益或者损害未成年人身心健康的；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    20、其他违反法律法规、公共政策、社会治安及公序良俗、干扰本服务正常运营或侵犯其他用户或第三方合法权益内容的其他信息。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    如果我们发现或收到他人举报或投诉用户违反本协议约定的，我们有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁直至注销的处罚，并公告处理结果。
                                </Typography>
                                <Typography variant="h4">【第三方产品及服务】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们允许第三方应用接入星河云海开放平台向您提供服务，您可以在工作台中通过添加应用的方式使用这类第三方服务。我们亦会与第三方合作，由第三方向您提供某些功能或服务，例如本服务中可能包含能跳转其他在线服务或资源的链接。在使用第三方服务的过程中，您除需遵守本协议的约定外，还需遵守第三方的用户协议、隐私政策等相关条款。您理解并认可，第三方服务由第三方服务方提供，除法律法规和本条款另有规定外，我们不对第三方服务承担任何责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您了解并同意，我们可能会对本服务及第三方应用政策及服务作出调整，该等调整可能会对我们或第三方的服务产生影响（如导致相关服务无法继续在本服务提供，或第三方应用的服务功能受限），除法律另有明确规定外，我们不承担相应责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您在选择使用第三方服务前应充分了解第三方产品或服务的功能、服务协议及隐私政策，再选择是否开通第三方服务。如您为客户的管理员，并基于客户授权选择开通第三方服务，在您开通第三方服务并向第三方服务提供方提供含有授权用户个人信息的数据（例如客户通讯录信息）前，客户及您应向所涉及的授权用户充分说明情况并取得授权用户的明确同意。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    本服务中可能包含能跳转其它在线服务或资源的链接，该等在线服务或资源可能是由第三方服务提供方提供。我们无法控制您对该等第三方服务或资源的使用，因此除非本协议另有约定，您使用第三方服务或资源的行为受您和相关第三方之间协议约束，我们不对您使用第三方服务或资源的行为承担任何责任。该等链接的存在不代表我们认可这些第三方服务或资源的合法性、安全性。
                                </Typography>
                                <Typography variant="h4">【用户内容】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    本服务允许您上传、创作或发送数字信息或材料（简称“用户内容”）。您亦可在用户内容上覆盖或增加我们提供的图案、贴纸、虚拟头像等其他元素。您承诺并保证，您拥有您上传、存储到本服务或通过本服务共享的您的内容的所有必要权利或已经获得合法授权，我们使用、展示和保留您的内容不会违反任何法律和他人的合法权利。我们不对您的内容及他人使用本服务上传、存储或共享的您的内容承担任何责任。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    如果您与本服务的其他用户分享您的用户内容，即表示您同意向这些用户授予不受限制且免费使用您用户内容的权利（包括任何知识产权等相关权益），除非您明确地向对方说明了该等限制，但该等说明及限制仅能约束您与对方。您承诺仅向本服务或通过本服务上传、传播、提供及分享您愿意并能够授予上述权利的用户内容。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们不会对您的用户内容主张任何所有权权利。请您注意，如果您以授权用户的身份使用本服务，我们会就您用户内容的使用方式向客户提供控制、限制、管理等诸多选择。例如，客户可启用或禁用其授权用户对本服务的访问权限，启用或禁用第三方服务，管理许可、保留和外传的设置等。企业用户的选择和决定可能会使您的部分或全部用户内容被访问、使用、披露、修改、限制使用或删除。如果您代表客户使用本服务，您确认客户将事先向其授权用户就此情况进行充分说明，并取得授权用户的明确同意。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    本服务并非存储服务，针对您的内容，或其他用户向本服务或通过本服务上传、传播或提供的任何其他内容，我们不能亦不会提供备份。请注意，即使在您的用户内容从本服务中删除后，其他用户仍可能独立地继续使用及允许他人使用您的用户内容（例如，该用户可能已将您的用户内容的副本保存在其帐号中）。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    对于您的用户内容，以及向本服务或通过本服务发布、递交或传送该内容之后果，您须自行负全责。您亦同意不会向本服务递交任何违反适用法律与规定的内容或其他材料。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您知悉并理解我们并无义务预审、监控、审查或编辑您和其他用户在本服务上撰写或发布的任何内容。我们建立了投诉举报渠道，您可以通过我们公示的投诉举报渠道或通过发送邮件至starcloud@starcloudgroup.com向我们投诉、举报各类违法违规行为、违法传播活动、违法有害信息等内容。在您进行投诉举报时，请您同时提供您相关权利或证明违法违规行为与内容的初步证据，我们会根据适用的法律法规及时受理和处理您的投诉举报。如果您发布的内容被相关权利人投诉举报，您也可以通过提交相反权利证明材料的方式向我们申诉，我们同样将会根据适用法律法规及时处理。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您理解并同意，您查看他人在本服务提供的内容时，应自行判断并承担相关风险。未经相关权利人的明示同意，您不得为任何目的使用、复制、转载、传播、播放、展示、出售、许可或其他未明示允许的方式使用该等内容。
                                </Typography>
                                <Typography variant="h4">【数据隐私与安全】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    本服务之使用，受《星河云海隐私政策》规范。您使用本服务，即代表您已阅读、理解并接受该隐私政策全部条款。如果您未满18周岁，在使用本服务前，应在您的父母或其他监护人监护、指导下共同阅读并同意该隐私政策。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    《星河云海隐私政策》可能会不时更新，以反映适用法律、法规、标准、行业规范等文件的更改，或反映本服务的更改、更新或新功能。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    《星河云海隐私政策》有任何更新后，若您继续访问或使用本服务即代表您已阅读、理解并接受了这些更新。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们与您一同致力于您个人信息的保护，我们会在符合商业常理之范围内，尽力采取与本服务相匹配的技术措施或其他安全措施保护您的个人信息安全。尽管如此，我们无法保证您在网络上或通过网络进行信息传输的安全性或保密性。
                                </Typography>
                                <Typography variant="h4">【知识产权】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您了解并同意，除非我们另有说明或相关权利人依照法律规定享有权利，否则本服务包含的产品、技术、软件、程序、数据及其他所有信息内容，包括但不限于文字、图片、音频、视频、图表、界面设计、版面框架、有关数据或电子文档等（简称“星河云海内容”）的所有知识产权（包括但不限于版权、商标权、专利权、商业秘密等）及相关权利均归我们或我们的关联公司所有。未经我们或相关权利人书面同意，您不得为任何商业或非商业目的自行或许可任何第三方使用（包括但不限于通过任何机器人、蜘蛛等程序或设备监视、复制、转载、散布、传播、播放、展示、出售、许可、镜像、上载、下载本服务中的内容）。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您应当和我们同样尊重知识产权。作为使用本服务的先决条件，您同意不会在使用本服务的过程中侵犯任何主体的知识产权（包括但不限于未经同意即擅自上传或分享他人受著作权法保护的材料）。
                                </Typography>
                                <Typography variant="h4">【违约与赔偿】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    如果您违反本协议和/或其他您应遵守的服务条款与规则，我们有权根据独立判断，视情况在不经事先通知您的情况下采取合理的处置措施，包括但不限于预先警示、限制、暂停、终止您使用本服务的部分或全部功能，屏蔽或删除您上传、传播或提供的内容、限制帐号部分或者全部功能、冻结或永久关闭帐号等，您需自行承担由此导致的后果及损失。我们有权公告处理结果并有权根据实际情况决定是否恢复相关帐号的使用，对已删除内容我们有权不予恢复或返还。对涉嫌违反法律法规、涉嫌违法犯罪的行为，我们将保存有关记录，并有权依法向有关主管部门报告、配合有关主管部门调查、向公安机关报案等。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    如果您违反本协议和/或其他您应遵守的服务条款与规则，引起第三方投诉、诉讼索赔等情况的，您应当自行处理并承担全部法律责任。若因您的违法或违约行为导致我们及我们的关联方、合作方等主体遭受任何损失（包括但不限于律师费用与支出）或行政处罚的，您应足额赔偿。
                                </Typography>
                                <Typography variant="h4">【有限担保】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您理解并同意，本服务是按照现有技术和条件所能达到的现状提供的。我们会尽最大努力向您提供连贯和安全的服务，但鉴于相关服务可能会受多种因素的影响或干扰，我们无法对包括但不限于下述内容进行保证：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、您使用本服务将完全满足您的需求
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、本服务连续不中断、即时、安全、无错误；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、本服务中任何错误都将能得到更正；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、本服务将与您的内容或我们未提供的任何其他硬件、软件、系统、服务或数据兼容。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在法律允许范围内，除本协议明文约定外，我们无法向您进行任何保证、担保或承诺。我们可能在不通知您的情况下，随时为商业或营运需要，改变、中止、撤回或限制本服务的全部或部分功能。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们将尽最大努力使本服务安全、稳定，但是您理解，我们不能随时预见和防范所有的技术或其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、基础运营商原因、电力供应故障、通讯网络故障、第三方服务瑕疵、系统更新与升级、政府部门调查、司法行政命令、第三方网站等原因可能导致的服务中断、数据丢失、不能正常使用以及其他类似情况。出现相应情况时，在条件允许的情况下，我们将努力在第一时间及时修复，但您同意，因上述原因产生的损失我们将免责，发生前述情况及基于该等原因取消或终止任何订单或服务的（如有且适用），不免除您在本协议下就我们已提供的服务部分履行相应付款义务。同时，您需要配置您自己的计算机设备、网络设置、计算机程序等，以使用本服务，您应为您的设备自行配置防毒程序。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    针对授权用户，在我方与客户间，您同意以下为客户之责任：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、告知您可能会影响您使用本服务的相关客户政策；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、在必要时，向您获取与客户权益及您使用本服务相关的授权；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3、基于客户组织管理需要，针对特定用户内容的转移与处理；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4、回复并解决任何与您或任何授权用户有关或源于与客户有关的用户信息，或是客户无法履行其义务所产生的争议或纠纷。
                                </Typography>
                                <Typography variant="h4">【责任限制】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在法律允许的范围内，针对下述情形，不论我们是否被告知或应察觉此类损害发生的可能，我们不会向您负有任何责任：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在法律允许的范围内，针对下述情形，不论我们是否被告知或应察觉此类损害发生的可能，我们不会向您负有任何责任：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1、任何间接性、偶然性、后果性、惩罚性、特殊性或刑罚性的损害和损失承担责任，包括但不限于预期利益、商誉及信誉、机会、数据资料损失、第三方费用。除法律另有明确规定外，任何情况下，我们向您承担损失赔偿责任的金额上限为您发生损失或我们违约的月份，您已经向我们支付的服务费。在法律允许的最大范围内，这些限制和条款适用于与本协议相关的任何事项或任何索赔。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2、任何因为以下原因对您造成的损失或损害：
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    1）您使用任何第三方产品或服务造成的损害；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    2）我们以任何方式修改、暂停提供本服务或者本服务内任何功能；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    3）您未向我们提供准确的帐号信息，或者您未按照本协议要求保护您的帐号密码安全；
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    4）其他因为您违反本协议约定的行为导致的损失。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在法律允许的最大范围内，您与任何第三方（包括但不限于例如任何移动网络服务商、权利所有者或其他用户）之间因您使用本服务而引起的任何争议都直接与您和该第三方相关，您必须排除我们对所有由此类争议引发的任何种类和性质的责任及损失（不论实际或间接）。
                                </Typography>
                                <Typography variant="h4">【费用】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    在移动应用上使用本服务时可能会产生数据流量费、通讯费、信息费等，在国际漫游的情况下可能会使费用增加，这些费用均由您自行承担。若您不确定这些费用，您应在使用本服务前咨询您的服务提供商。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    您知悉并理解，针对试用或其他暂不收费服务不应被视为我们放弃后续向您收费的权利。我们有权根据实际运营情况通过官方网站、公告或其他适当的方式通知您收费标准、方式或相关变更。如果您不同意上述修改、变更或付费内容，您可以选择停止使用该产品或服务。
                                </Typography>
                                <Typography variant="h4">【其他条款】</Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    协议内容与修订：本协议内容包括本协议正文及所有我们已经发布或将来可能发布的隐私政策、各项规则、通知。前述内容均为本协议不可分割的组成部分，与本协议具有同等法律效力。为给您提供更好的服务或因国家法律法规、政策调整、技术条件、产品功能等变化需要，我们会适时对本协议进行修订，修订内容构成本协议的组成部分。本协议更新后，我们会以适当的方式提醒您更新的内容，以便您及时了解本协议的最新版本，您也可以在网站首页或软件设置页面查阅最新版本的协议条款。如您对修订后的协议内容存有异议，您有权立即停止使用本服务。如您在修订协议生效日后继续使用本服务，即表示您已同意接受修订后的本协议内容。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    适用法律与管辖：本协议的成立、生效、履行、解释及争议解决均应适用中华人民共和国大陆地区法律。如果本协议的任何约定被判决或裁定无效，则这些条款应在不违反法律的前提下，按照尽可能接近本协议原条款目的的原则进行重新解释和适用，且不影响本协议中其他条款的效力。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    本协议的签订地为中华人民共和国杭州市余杭区，因本协议所引发的争议双方应尽量友好协商解决，协商不成的，您同意将争议提交至本协议签订地有管辖权的人民法院解决。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    未经我们事先书面同意，您不得向任何第三方转让您在本条款项下的任何权利或义务。您理解并同意，我们有权自主决定经营策略并根据业务调整情况将本协议项下的全部权利义务一并转移给我们的关联公司或其他法律主体，您认可在上述情况下，我们无须征得您的同意，我们将尽量以合理的方式向您通知。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    我们暂时未主张或强制执行本协议的任何约定，不应被视为我们豁免该等约定或放弃该等权利。
                                </Typography>
                                <Typography
                                    sx={{
                                        textIndent: '2em',
                                        '&:first-line': {
                                            textIndent: 0
                                        }
                                    }}
                                >
                                    为方便阅读理解，本协议会被翻译成多个语言版本，若不同版本之间存在冲突，以本协议中文简体版本为准。
                                </Typography>
                            </Stack>
                        </MainCard>
                    </Grid>
                </Grid>
            </Container>
        </HeaderWrapper>
    );
};

export default PrivacyPolicy;
