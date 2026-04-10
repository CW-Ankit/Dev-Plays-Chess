const { ROLE_OPTIONS } = require("../config/constants");

const sanitizeName = (name = "") => name.trim().slice(0, 24);

const validateStartPayload = ({ name, preferredRole }) => {
    const safeName = sanitizeName(name);

    if (!safeName) {
        return { error: "Name is required." };
    }

    const allowedRoles = Object.values(ROLE_OPTIONS);
    const safeRole = allowedRoles.includes(preferredRole) ? preferredRole : ROLE_OPTIONS.ANY;

    return {
        data: {
            username: safeName,
            preferredRole: safeRole
        }
    };
};

module.exports = {
    sanitizeName,
    validateStartPayload
};
