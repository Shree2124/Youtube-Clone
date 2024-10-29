import React, { useState } from "react";
import styled from "styled-components";
import { TextField, Button } from "@mui/material";
import axios from "../../api/axios";
import { Label } from "@mui/icons-material";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  width: 400px;
  margin: auto;
`;

const FormTitle = styled.h2`
  font-size: 1.7rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const StyledTextField = styled(TextField)`
  background-color: ${({ theme }) => theme.bgLighter};
  && {
    margin-bottom: 20px;
    .MuiInputBase-root {
      color: ${({ theme }) => theme.text};
    }
    .MuiInputLabel-root {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const VideoInput = styled.input`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const SubmitButton = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    &:hover {
      background-color: ${({ theme }) => theme.secondary};
    }
  }
`;

const UploadVideo = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    tags: "",
    video: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleVideoChange = (e) => {
    setFormValues({ ...formValues, video: e.target.files[0] });
  };

  const upload = async ()=>{
    try {
      await axios.post('/add-video',{

      })
    } catch (error) {
      
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <FormWrapper>
      <FormTitle>Upload Video</FormTitle>
      <form onSubmit={handleSubmit}>
        <StyledTextField
          label="Title"
          variant="outlined"
          name="title"
          value={formValues.title}
          onChange={handleInputChange}
          fullWidth
        />
        <StyledTextField
          label="Description"
          variant="outlined"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />
        <StyledTextField
        placeholder="Tags (comma-separated)"
          label="Tags"
          variant="outlined"
          name="tags"
          value={formValues.tags}
          onChange={handleInputChange}
          fullWidth
        />
        <Label>
          Video
        </Label>
        <VideoInput type="file" accept="video/*" onChange={handleVideoChange} />
        <Label>
          Thumbnail
        </Label>
        <VideoInput type="file" accept="image/*" onChange={handleVideoChange} />
        <SubmitButton type="submit" variant="contained" fullWidth>
          Submit
        </SubmitButton>
      </form>
    </FormWrapper>
  );
};

export default UploadVideo;
