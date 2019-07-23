const menuGlobal=[
    {
        id:'pageOne',
        pid:'0',
        name:'pageOne页',
        icon:'user',
        path: '/pageOne',
        models: () => [import('../models/pageOne')],
        component: () => import('../routes/PageOne'),
    },
    {
        id:'pageTwo',
        pid:'0',
        name:'pageTwo页',
        icon:'user',
        path: '/pageOne/pageTwo',
        models: () => [import('../models/pageTwo')],
        component: () => import('../routes/PageTwo'),
    },
    {
        id:'pageThree',
        pid:'0',
        name:'pageThree页',
        icon:'user',
        path: '/pageThree',
        models: () => [import('../models/pageThree')],
        component: () => import('../routes/PageThree'),
    },
];

export default {
    menuGlobal
}