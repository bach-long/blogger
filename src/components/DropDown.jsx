import React from 'react';
import { Button, Dropdown, Menu, Space } from 'antd';
import {DownOutlined} from '@ant-design/icons';

const menu = (
    <Menu
      items={[
        {
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
          key: '0',
        },
        {
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item
            </a>
          ),
          key: '1',
        },
        {
          type: 'divider',
        },
        {
          label: '3rd menu item（disabled）',
          key: '3',
          disabled: true,
        },
      ]}
    />
  );

const DropDown = ({data}) => {
  return (
    <Dropdown overlay={menu}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Hover me
            <DownOutlined />
          </Space>
        </a>
    </Dropdown>
  )
}

export default DropDown;