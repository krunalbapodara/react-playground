import styled from 'styled-components';

const TaskBox = styled.div`
  background: #fff;
  -webkit-box-shadow: 3px 1px 5px -1px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 1px 5px -1px rgba(0,0,0,0.75);
  box-shadow: 3px 1px 5px -1px rgba(0,0,0,0.75);
  border-radius:3px;
  overflow: hidden;
  position: absolute;
  left: 0;
  z-index:999;
  width: 450px;
  top:20px;
  height: calc(100% - 50px);

  .editPanelTopBar {
    font-size:24px;
    font-weight:500;
    background: #fff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    line-height: 1;
    color:#898989;

    span {
      margin: 0;
      margin-left: 15px;
      cursor: pointer;
      i {
        color:#898989;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
  .editPanelContent {
    padding: 10px 10px 0;
  }
  
  @media only screen and (min-width: 768px) {
    width: 500px;
  }
`;

const PlaybookWindow = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  @media only screen and (max-width: 767px) {
    > div {
      width: 100%;
      max-width: 100%;
    }
  }
`;


const PlaybookBox = styled.div`
  width: 100%;
  background-color: #fff;
  border: 0;
  border-left-width: 0;
  display: flex;
  z-index:100;
  padding:0;
  flex-direction: column;

  @media only screen and (max-width: 767px) {
    border-left-width: 1px;
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    width: calc(100% - 280px);
  }
`;

const SingleTask=styled.div`
  width: 100%;
  padding:10px;
  background:#f5f5f5;
  border:1px solid #d3dbe5;
  margin-bottom:5px;

  .tName{
    display: flex;
    justify-content: space-between;
    margin-bottom:15px;

    span{
      font-size:15px;
      font-weight:450;
    }

    i{
      &:hover {
        color:grey;
        transform: scale(1.2, 1.2);
        transitions:.5s;
      }
    }
  }

  .tDesc{
    bottom:0;
    display: flex;
    justify-content: space-between;

    span{
      font-size:13px;
      padding-right:20px;
      white-space: nowrap; 
      overflow: hidden;
      text-overflow: ellipsis; 
    }

    .addBtn{
      width:40px;
    }
  }
`;


export { TaskBox, PlaybookWindow, PlaybookBox, SingleTask };
