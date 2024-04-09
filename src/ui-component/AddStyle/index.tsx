import { SearchOutlined } from '@mui/icons-material';
import { Button, Card, Divider, Image, Dropdown, MenuProps, Space, Drawer, Checkbox, Collapse } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, InputAdornment, IconButton, Select } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';

const data = [
    {
        id: '1',
        name: '风格 1',
        enable: true,
        templateList: [
            {
                id: 'clu6prt390001swncteeo8lrh',
                name: '首图',
                variableList: [
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片2',
                        field: '420f7603-4556-4e15-9e98-cc902acef689',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片2',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片3',
                        field: 'd13a3fb2-9c8b-42b7-9b77-58198114f475',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片3',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片4',
                        field: '149d8207-b4c5-4637-b67b-ccbe230ad88d',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片4',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片5',
                        field: '0192159c-8627-4c04-a680-6be0495c5220',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片5',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片6',
                        field: '4407184b-6993-4c88-92c0-b3114b28803a',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片6',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片7',
                        field: 'e91f3412-b9ef-4825-b458-b3040b2d9e08',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片7',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片8',
                        field: '01288d03-7a49-4abd-be8f-79db70411ede',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片8',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片副标题',
                        field: 'SUB_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '请相信我们都会变得更强大',
                        isShow: false,
                        isPoint: true,
                        description: '图片副标题',
                        options: [],
                        count: 12
                    },
                    {
                        label: '图片主标题',
                        field: 'TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{标题生成.data}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片主标题',
                        options: [],
                        count: 19
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 1',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 2',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 3',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 4',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 5',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        name: '风格 2',
        enable: true,
        templateList: [
            {
                id: 'clu6prt390001swncteeo8lrh',
                name: '首图',
                variableList: [
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片2',
                        field: '420f7603-4556-4e15-9e98-cc902acef689',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片2',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片3',
                        field: 'd13a3fb2-9c8b-42b7-9b77-58198114f475',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片3',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片4',
                        field: '149d8207-b4c5-4637-b67b-ccbe230ad88d',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片4',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片5',
                        field: '0192159c-8627-4c04-a680-6be0495c5220',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片5',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片6',
                        field: '4407184b-6993-4c88-92c0-b3114b28803a',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片6',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片7',
                        field: 'e91f3412-b9ef-4825-b458-b3040b2d9e08',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片7',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片8',
                        field: '01288d03-7a49-4abd-be8f-79db70411ede',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片8',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片副标题',
                        field: 'SUB_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '请相信我们都会变得更强大',
                        isShow: false,
                        isPoint: true,
                        description: '图片副标题',
                        options: [],
                        count: 12
                    },
                    {
                        label: '图片主标题',
                        field: 'TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{标题生成.data}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片主标题',
                        options: [],
                        count: 19
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 1',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 2',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 3',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 4',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 5',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 6',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 7',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 8',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            }
        ]
    },
    {
        id: '3',
        name: '风格 3',
        enable: true,
        templateList: [
            {
                id: 'clu6prt390001swncteeo8lrh',
                name: '首图',
                variableList: [
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片2',
                        field: '420f7603-4556-4e15-9e98-cc902acef689',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片2',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片3',
                        field: 'd13a3fb2-9c8b-42b7-9b77-58198114f475',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片3',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片4',
                        field: '149d8207-b4c5-4637-b67b-ccbe230ad88d',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片4',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片5',
                        field: '0192159c-8627-4c04-a680-6be0495c5220',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片5',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片6',
                        field: '4407184b-6993-4c88-92c0-b3114b28803a',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片6',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片7',
                        field: 'e91f3412-b9ef-4825-b458-b3040b2d9e08',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片7',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片8',
                        field: '01288d03-7a49-4abd-be8f-79db70411ede',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片8',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片副标题',
                        field: 'SUB_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '请相信我们都会变得更强大',
                        isShow: false,
                        isPoint: true,
                        description: '图片副标题',
                        options: [],
                        count: 12
                    },
                    {
                        label: '图片主标题',
                        field: 'TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{标题生成.data}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片主标题',
                        options: [],
                        count: 19
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 1',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 2',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 3',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 4',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            }
        ]
    },
    {
        id: '4',
        name: '风格 4',
        enable: true,
        templateList: [
            {
                id: 'clu6prt390001swncteeo8lrh',
                name: '首图',
                variableList: [
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片2',
                        field: '420f7603-4556-4e15-9e98-cc902acef689',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片2',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片3',
                        field: 'd13a3fb2-9c8b-42b7-9b77-58198114f475',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片3',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片4',
                        field: '149d8207-b4c5-4637-b67b-ccbe230ad88d',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片4',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片5',
                        field: '0192159c-8627-4c04-a680-6be0495c5220',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[4].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片5',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片6',
                        field: '4407184b-6993-4c88-92c0-b3114b28803a',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[5].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片6',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片7',
                        field: 'e91f3412-b9ef-4825-b458-b3040b2d9e08',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[6].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片7',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片8',
                        field: '01288d03-7a49-4abd-be8f-79db70411ede',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[7].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片8',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片副标题',
                        field: 'SUB_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '请相信我们都会变得更强大',
                        isShow: false,
                        isPoint: true,
                        description: '图片副标题',
                        options: [],
                        count: 12
                    },
                    {
                        label: '图片主标题',
                        field: 'TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{标题生成.data}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片主标题',
                        options: [],
                        count: 19
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 1',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[0].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 2',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[1].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'clu6qls060003swncmit7lkrk',
                name: '图片 3',
                variableList: [
                    {
                        label: '书名',
                        field: '17515a8d-edef-473c-8f65-d54cd0271e5a',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '书名',
                        options: [],
                        count: null
                    },
                    {
                        label: '作者',
                        field: '255675af-f732-48f3-a4c1-899634a72077',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '作者',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: '0ecc8d3c-a6e7-44f8-8a04-2e47b4a8a335',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '简介',
                        field: '97ebe6a5-2efa-480a-ac46-e41b7c1879dd',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[2].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '简介',
                        options: [],
                        count: null
                    }
                ]
            },
            {
                id: 'cluc41iy10005swncf2gxnqel',
                name: '图片 4',
                variableList: [
                    {
                        label: '文案标题',
                        field: 'TEXT_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].bookName}}',
                        isShow: false,
                        isPoint: true,
                        description: '文案标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-标题',
                        field: 'PARAGRAPH_ONE_TITLE',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].author}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-标题',
                        options: [],
                        count: null
                    },
                    {
                        label: '图片1',
                        field: 'd5d6d834-0fb2-4059-9e16-b18bd2b4a54e',
                        type: 'IMAGE',
                        group: 'PARAMS',
                        style: 'IMAGE',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].coverUrl}}',
                        isShow: false,
                        isPoint: true,
                        description: '图片1',
                        options: [],
                        count: null
                    },
                    {
                        label: '段落-1-内容',
                        field: 'PARAGRAPH_ONE_CONTENT',
                        type: 'TEXT',
                        group: 'PARAMS',
                        style: 'INPUT',
                        order: 2147483647,
                        defaultValue: null,
                        value: '{{上传素材.docs[3].introduction}}',
                        isShow: false,
                        isPoint: true,
                        description: '段落-1-内容',
                        options: [],
                        count: null
                    }
                ]
            }
        ]
    }
];

const AddStyle = () => {
    const [visible, setVisible] = useState(false);
    const [styleData, setStyleData] = useState<any>([]);
    const [selectImgs, setSelectImgs] = useState<
        {
            id: string;
            src: string;
        }[]
    >([]);

    const [query, setQuery] = useState<any | null>(null);
    const [hoverIndex, setHoverIndex] = useState<any>('');
    const [chooseImageIndex, setChooseImageIndex] = useState<any>('');
    const [type, setType] = useState<any>();
    const [editIndex, setEditIndex] = useState<any>();
    const [templateList, setTemplateList] = useState<any[]>([]);
    const collapseIndexRef: any = useRef(null);

    React.useEffect(() => {
        const list = data.map((item) => ({
            name: item.name,
            list: [
                {
                    id: 3,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                }
            ]
        }));
        setStyleData(list);
    }, [data]);

    const handleAdd = () => {
        setType(0);
        setVisible(true);
    };

    const handleQuery = ({ label, value }: { label: string; value: string }) => {
        setQuery({
            ...query,
            [label]: value
        });
    };

    useEffect(() => {
        if (query?.picNum) {
        }
    }, [query]);

    const IMAGE_LIST = [
        {
            id: '1',
            src: [
                {
                    id: 1,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 2,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 3,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 4,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                }
            ]
        },
        {
            id: '2',
            src: [
                {
                    id: 1,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 2,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 3,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                }
            ]
        },
        {
            id: '3',
            src: [
                {
                    id: 1,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 2,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                },
                {
                    id: 3,
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                }
            ]
        }
    ];

    const handleChoose = (index: number) => {
        setChooseImageIndex(index);
        const list: any = IMAGE_LIST[index].src;
        setSelectImgs([...list]);

        // const index = selectImgs.map((item) => item.id).findIndex((v) => v === id);
        // if (index > -1) {
        //     const copySelectImgs = [...selectImgs];
        //     copySelectImgs.splice(index, 1);
        //     setSelectImgs([...copySelectImgs]);
        // } else {
        //     const copySelectImgs = [...selectImgs];
        //     copySelectImgs.push({ id, src });
        //     console.log(copySelectImgs, 'copySelectImgs');
        //     setSelectImgs([...copySelectImgs]);
        // }
    };

    const items: any = [
        {
            key: '1',
            label: (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        const index: any = collapseIndexRef.current;
                        const copyStyleData = [...styleData];
                        copyStyleData.splice(index, 1);
                        setStyleData(copyStyleData);
                    }}
                >
                    删除
                </span>
            )
        },
        {
            key: '2',
            label: (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        const index: any = collapseIndexRef.current;
                        const copyStyleData = [...styleData];
                        copyStyleData.splice(index + 1, 0, { ...copyStyleData[index], name: `${copyStyleData[index].name}_复制` });
                        setStyleData(copyStyleData);
                    }}
                >
                    复制
                </span>
            )
        }
    ];

    const handleOK = () => {
        // 取最大的+1
        if (type === 0) {
            const list = styleData.map((item: any) => item.name);
            let maxNumber = Math.max(...list.map((item: any) => parseInt(item.match(/\d+/))));
            setStyleData([
                ...styleData,
                {
                    name: `风格 ${maxNumber + 1}`,
                    list: selectImgs
                }
            ]);
        }
        if (type === 1) {
            styleData[editIndex].list = selectImgs;
            setStyleData([...styleData]);
        }
        setVisible(false);
    };

    const collapseList = React.useMemo(() => {
        return styleData.map((item: any, index: number) => ({
            key: index,
            label: (
                <div className="flex justify-between">
                    <span>{item.name}</span>
                    <Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']}>
                        <span
                            onClick={(e) => {
                                collapseIndexRef.current = index;
                                e.stopPropagation();
                            }}
                        >
                            <MoreVertIcon className="cursor-pointer" />
                        </span>
                    </Dropdown>
                </div>
            ),
            children: (
                <div>
                    <div className="mb-3">风格示意图{item.list.length}张</div>
                    <div>
                        <Image.PreviewGroup
                            preview={{
                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`)
                            }}
                        >
                            {item.list.map((item: any, index: number) => (
                                <Image width={160} height={200} src={item.src} />
                            ))}
                        </Image.PreviewGroup>
                    </div>
                    <Divider
                        style={{
                            margin: '16px 0'
                        }}
                    />
                    <div className="flex justify-between">
                        <Button
                            onClick={() => {
                                setType(1);
                                setVisible(true);
                                setEditIndex(index);
                            }}
                        >
                            选择模版风格
                        </Button>
                        <div className="flex justify-center items-center cursor-pointer">
                            <span>点击放大编辑</span>
                            <SearchOutlined />
                        </div>
                    </div>
                </div>
            )
        }));
    }, [styleData]);

    return (
        <div className="p-3">
            <div className="py-3">
                <Button onClick={() => handleAdd()}>增加风格</Button>
            </div>
            <div>
                <Collapse accordion items={collapseList} defaultActiveKey={[0]} />
            </div>
            <Drawer
                title="选择模版"
                onClose={() => setVisible(false)}
                open={visible}
                width={500}
                footer={
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <p>选择模版：</p>
                            <div>
                                {selectImgs.map((item, index) => (
                                    <Image width={32} height={40} src={item.src} preview={false} />
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            <Space>
                                <Button onClick={() => setVisible(false)}>取消</Button>
                                <Button type="primary" onClick={() => handleOK()}>
                                    确定
                                </Button>
                            </Space>
                        </div>
                    </div>
                }
            >
                <div className="grid grid-cols-3 gap-3">
                    {/* <FormControl key={query?.color} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">色调</InputLabel>
                        <Select
                            value={query?.color}
                            onChange={(e: any) => handleQuery({ label: 'type', value: e.target.value })}
                            endAdornment={
                                query?.color && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'type', value: '' });
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="色调"
                        >
                            <MenuItem value={'XHS'}>小红书</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl key={query?.topic} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">主题</InputLabel>
                        <Select
                            value={query?.topic}
                            onChange={(e: any) => handleQuery({ label: 'type', value: e.target.value })}
                            endAdornment={
                                query?.topic && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'type', value: '' });
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="主题"
                        >
                            <MenuItem value={'XHS'}>小红书</MenuItem>
                        </Select>
                    </FormControl> */}
                    <FormControl key={query?.picNum} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">图片数量</InputLabel>
                        <Select
                            value={query?.picNum}
                            onChange={(e: any) => handleQuery({ label: 'picNum', value: e.target.value })}
                            endAdornment={
                                query?.picNum && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'picNum', value: '' });
                                            }}
                                        >
                                            <ClearIcon
                                                style={{
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="图片数量"
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <div className="flex items-center mt-1">
                        <InfoIcon
                            style={{
                                fontSize: '12px'
                            }}
                        />
                        <p className="text-xs">系统根据您的商品信息，为您找到了3款图片模版供您选择</p>
                    </div>
                    <div className="mt-3">
                        {IMAGE_LIST.map((item, index) => {
                            return (
                                <div
                                    className={`flex overflow-x-auto cursor-pointer ${
                                        hoverIndex === index || chooseImageIndex === index
                                            ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                            : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                    } rounded-sm my-3`}
                                    onClick={() => handleChoose(index)}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex('')}
                                >
                                    {item.src.map((v: any, vi: number) => (
                                        <img key={index} width={145} height={200} src={v.src} />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default AddStyle;
