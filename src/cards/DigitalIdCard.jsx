import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing20, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography, Button } from '@ellucian/react-design-system/core';
import { useCardControl } from '@ellucian/experience-extension-utils';
import PropTypes from 'prop-types';

const styles = () => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40
    },
    topSpacing20: {
        marginTop: spacing20
    },
    topSpacing40: {
        marginTop: spacing40
    },
    bottomSpacing20: {
        marginBottom: spacing20
    },
    bottomSpacing40: {
        marginBottom: spacing40
    }
});

const DigitalIdCard = (props) => {
    const {
        classes,
    } = props;
    const { navigateToPage } = useCardControl();
    return (
        <div className={classes.card}>
            <Typography className={classes.bottomSpacing40}>
                Need your Student ID card to access the Buchanan Library, PE Building, or other resources? No problem! Just click <strong>View my Digital ID</strong> below.
            </Typography>
            <Button onClick={() => navigateToPage({ route: '/'})}>View my Digital ID</Button>
        </div>
    );
};

DigitalIdCard.propTypes = {
    classes: PropTypes.object.isRequired,
    cardControl: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

export default withStyles(styles)(DigitalIdCard);