// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    const response = await fetch('https://service.pace-unv.cloud/api/notes');
    const data = await response.json();
    res.status(200).json(data);
}
