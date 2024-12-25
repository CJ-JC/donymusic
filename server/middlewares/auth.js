export const checkAuth = async (req, res) => {
    try {
        if (req.session && req.session.user) {
            return res.status(200).json({ isAuthenticated: true, user: req.session.user });
        } else {
            return res.status(401).json({ isAuthenticated: false, message: "Vous n'êtes pas connecté" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
