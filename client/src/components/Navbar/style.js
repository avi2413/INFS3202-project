import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    appBar: {
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //alignItems: 'center',
        padding: '15px 10px',
        background: '#ff9800',
        marginBottom: '10px'
    },
    heading: {
        color: 'white',
        fontWeight: 'bold',
        textDecoration: 'none',
        paddingTop: '5px'
    },
    //   image: {
    //     marginLeft: '15px',
    //   },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        //width: '100wh',
    },
    profile: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100px',
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto'
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        width: 55,
        height: 55
    },
}));