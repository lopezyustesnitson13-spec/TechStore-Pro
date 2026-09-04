// Middleware: verifica que el usuario autenticado tenga rol admin
function VerificarAdmin(req, res, next) {
    if (!req.usuario) {
        return res.status(401).json({ error: 'sin autentiacion'});
    }
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'acceso denegado - se requiere rol admin' });
    } 
    next(); // solo llega aqui si el token Y el rol es admin
}

module.exports = VerificarAdmin;