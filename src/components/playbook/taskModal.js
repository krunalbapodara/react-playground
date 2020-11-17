import React, { Component } from 'react';
import { Modal } from 'antd';

class TaskModal extends Component {
    state = {  }
    render() { 
        const {taskModal,modalType,task,handleCancel}=this.props
        return ( 
            <Modal
                title={modalType==='new' ? "New Task" : task.name}
                visible={taskModal}
                centered
                maskClosable={false}
                mask={false}
                style={{float:"left",top:"50px",left:"30xp"}}
                onOk={this.handleOk}
                onCancel={handleCancel}>
                    asdfsdfsf
            </Modal> 
        );
    }
}
 
export default TaskModal;