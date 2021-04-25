import { Router } from 'express';
import axios from 'axios';

const router = Router();
const BASE_URL = 'https://api.groupme.com/v3/groups';

router.get('/', async (req, res) => {
    const groupId = process.env.GROUP_ID;
    const token = process.env.API_TOKEN;

    try {
        const response = await axios.get(
            `${BASE_URL}/${groupId}?token=${token}`
        );
        res.send(response.data.response.members);
    } catch (e) {
        console.log(e);
    }
});

export { router as membersRouter };
