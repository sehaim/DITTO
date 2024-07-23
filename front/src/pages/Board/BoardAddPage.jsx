import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import useAxios from "../../hooks/useAxios";
import Button from "../../components/common/Button";
import OutlineButton from "../../components/common/OutlineButton";
import TabBar from "../../components/Board/TabBar";
import Filter from "../../components/Board/Filter";
import SelectBox from "../../components/Board/SelectBox";
import SelectTag from "../../components/Board/SelectTag";
import BoardEditor from "../../components/Board/BoardAdd/BoardEditor";
import {
  BOARD_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  getTagsForCategory,
  getBoardTypeLabelByValue,
  getCategoryLabelByValue,
} from "../../utils/options";

const Wrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 32px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: var(--PRIMARY);
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 48px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NameInput = styled.div`
  width: 160px;
  padding: 8px;
  border: 1px solid var(--BORDER_COLOR);
  border-radius: 10px;
  background-color: var(--LIGHT);
  white-space: nowrap;
  color: var(--TEXT_SECONDARY);
  font-size: 14px;
`;

const EditorWrapper = styled.div`
  margin-top: 48px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 32px;
`;

function BoardAddPage() {
  const { response: getResponse, sendRequest: getPost } = useAxios();
  const { sendRequest } = useAxios();
  // router
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEdit = Boolean(postId);

  const handleCancel = () => {
    navigate("/board/all");
  };

  const [postData, setPostData] = useState({
    userId: 1,
    username: "김싸피",
    boardId: 1,
    categoryId: 1,
    tagId: 1,
    title: "",
    content: "",
  });

  useEffect(() => {
    if (isEdit) {
      getPost(`/posts/${postId}`, null, "get");
    }
  }, [isEdit, postId]);

  useEffect(() => {
    console.log(getResponse);
    if (getResponse) {
      setPostData({
        userId: 1,
        username: "김싸피",
        boardId: getResponse?.data?.boardId,
        categoryId: getResponse?.data?.categoryId,
        tagId: getResponse?.data?.tagId,
        title: getResponse?.data?.title,
        content: getResponse?.data?.content,
      });
    }
  }, [getResponse]);

  // form
  const [category, setCategory] = useState(postData?.categoryId);
  const [tags, setTags] = useState(getTagsForCategory(postData?.categoryId));

  useEffect(() => {
    setTags(getTagsForCategory(category));
    let ret = 1;
    switch (category) {
      case 1:
        ret = 1;
        break;
      case 2:
        ret = 6;
        break;
      case 3:
        ret = 12;
        break;
      case 4:
        ret = 14;
        break;
    }
    setPostData((prevState) => ({
      ...prevState,
      tagId: ret,
    }));
  }, [category]);

  const handleBoardType = (event) => {
    setPostData((prevState) => ({
      ...prevState,
      boardId: event.target.value,
    }));
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
    setPostData((prevState) => ({
      ...prevState,
      categoryId: event.target.value,
    }));
  };

  const handleTag = (tagId) => {
    setPostData((prevState) => ({
      ...prevState,
      tagId,
    }));
  };

  const handleTitle = (event) => {
    setPostData((prevState) => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const handleEditor = (content) => {
    setPostData((prevState) => ({
      ...prevState,
      content,
    }));
  };

  const handleSave = async () => {
    const url = isEdit ? `/posts/${postId}` : "/posts";
    const method = isEdit ? "patch" : "post";

    try {
      await sendRequest(url, postData, method);
      handleCancel();
    } catch (error) {}
  };

  return (
    <div>
      <TabBar />
      <Wrapper>
        <PageTitle>{isEdit ? "게시글 수정" : "게시글 작성"}</PageTitle>
        <FilterWrapper>
          <Filter title="게시판">
            <SelectBox
              options={BOARD_TYPE_OPTIONS}
              onChange={handleBoardType}
              curOption={getBoardTypeLabelByValue(postData?.boardId)}
            />
          </Filter>
          <Filter title="작성자">
            <NameInput>{postData?.username}</NameInput>
          </Filter>
        </FilterWrapper>
        <FilterWrapper>
          <Filter title="카테고리">
            <SelectBox
              options={CATEGORY_OPTIONS}
              onChange={handleCategory}
              curOption={getCategoryLabelByValue(category)}
            />
          </Filter>
          <Filter title="태그">
            <SelectTag
              tags={tags}
              curTag={postData?.tagId}
              handleTag={handleTag}
            />
          </Filter>
        </FilterWrapper>
        <EditorWrapper>
          <BoardEditor
            title={postData?.title}
            content={postData?.content}
            onTitleChange={handleTitle}
            onEditorChange={handleEditor}
          />
        </EditorWrapper>
        <Buttons>
          <OutlineButton onClick={handleCancel} label="취소" color="default" />
          <Button onClick={handleSave} label={isEdit ? "수정" : "등록"} />
        </Buttons>
      </Wrapper>
    </div>
  );
}

export default BoardAddPage;
