import app from './app';

const PORT = process.env.PORT || 4000;

app.get('./home', (req, res) => {
    res.send('test route workin')
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
 