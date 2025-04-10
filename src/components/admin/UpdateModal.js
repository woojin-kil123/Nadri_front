import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const UpdateModal = ({ onClose, placeType, setIsUpdate, event }) => {
  const [formData, setFormData] = useState({
    eventTitle: "",
    placeTypeId: "",
    eventContent: "",
    startDate: "",
    endDate: "",
    eventImg: "",
  });
  const thumbRef = useRef(null);
  useEffect(() => {
    if (event) {
      setFormData(event.extendedProps);
      thumbRef.current.src = `${process.env.REACT_APP_BACK_SERVER}/event/thumb/${event.extendedProps.eventImg}`;
    }
  }, []);
  const [thumb, setThumb] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const changeThumb = (file) => {
    if (file) {
      const thumbUrl = URL.createObjectURL(file);
      setThumb(thumbUrl);
    }
  };
  //언마운트시 자원반환
  useEffect(() => {
    return () => {
      if (thumb) {
        URL.revokeObjectURL(thumb);
      }
    };
  }, [thumb]);
  const onSave = () => {
    if (!formData.eventImg) {
      Swal.fire({
        icon: "warning",
        title: "이미지가 없습니다.",
        text: "이벤트 이미지를 확인해주세요",
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflow = "unset";
          document.body.style.paddingRight = "0px";
        },
        didClose: () => {
          document.body.style.overflow = "unset";
          document.body.style.paddingRight = "0px";
        },
      });
      return;
    }

    const form = new FormData();
    form.append("eventTitle", formData.eventTitle);
    form.append("placeTypeId", formData.placeTypeId);
    form.append("eventContent", formData.eventContent);
    form.append("startDate", formData.startDate);
    form.append("endDate", formData.endDate);

    // ✅ 파일이 변경된 경우에만 이미지 append
    const isImageUpdated = formData.eventImg instanceof File;
    if (isImageUpdated) {
      form.append("img", formData.eventImg);
    }
    let request = "";
    if (event) {
      const eventNo = event.extendedProps.eventNo;
      request = axios.patch(
        `${process.env.REACT_APP_BACK_SERVER}/admin/event/${eventNo}`,
        form,
        {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        }
      );
    } else {
      request = axios.post(
        `${process.env.REACT_APP_BACK_SERVER}/admin/event`,
        form,
        {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        }
      );
    }

    request.then((res) => {
      if (res.data > 0) {
        setFormData({
          eventTitle: "",
          placeTypeId: "",
          eventContent: "",
          startDate: "",
          endDate: "",
          eventImg: "",
        });
        setIsUpdate((prev) => !prev);
        onClose();
      }
    });
  };
  return (
    <div className="modal-form-wrapper">
      <div className="modal-form-content">
        <form
          className="modal-form-layout-column"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="form-column image-side">
            <label htmlFor="imageUpload" className="image-label">
              <div className="image-preview">
                <img
                  ref={thumbRef}
                  src={thumb ? thumb : "/image/default_img.png"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                ></img>
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                changeThumb(file);
                setFormData((prev) => ({ ...prev, eventImg: file })); // 프로필 이미지 상태 업데이트
              }}
            />
          </div>
          <div className="modal-form-top">
            <div className="form-column input-side">
              <div className="form-grid">
                <label>
                  제목
                  <input
                    type="text"
                    name="eventTitle"
                    value={formData.eventTitle || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  종류
                  <select
                    name="placeTypeId"
                    onChange={handleChange}
                    required
                    value={formData.placeTypeId}
                  >
                    <option value="">선택</option>
                    {placeType.map((type, i) => (
                      <option key={"eventType" + i} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="full-width">
                  내용
                  <textarea
                    type="text"
                    name="eventContent"
                    value={formData.eventContent || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  시작일
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  종료일
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ""}
                    onChange={handleChange}
                    min={formData.startDate}
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="modal-form-buttons center">
            {!event && <button>등록하기</button>}
            {event && <button>수정하기</button>}
            <button type="button" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateModal;
