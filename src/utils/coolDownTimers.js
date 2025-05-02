import { emailVerification } from "../schema/emailVerification.js"
import { Users } from "../schema/users.js";

export const deleteEmailTimer = ({ emailDb }) => {
    setTimeout(async () => {
        try {
            await emailVerification.findByIdAndDelete(emailDb._id);
        } catch (err) {
            console.error('Failed to delete email verification record:', err);
        }
    }, 2 * 60 * 1000);
};