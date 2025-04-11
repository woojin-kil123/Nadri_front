import { useEffect, useState } from "react";
import "./place.css";
import axios from "axios";
import StarRating from "../utils/StarRating";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRecoilValue } from "recoil";
import { memberNoState } from "../utils/RecoilData";

const PlaceDetail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [review, setReview] = useState([]);
  const placeId = useParams().placeId;
  const [place, setPlace] = useState();
  const navigate = useNavigate();

  const memberNo = useRecoilValue(memberNoState);

  useEffect(() => {
    axios
      .get(`${backServer}/place/detail?placeId=${placeId}`)
      .then((res) => {
        console.log(res);
        setPlace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${backServer}/review/detail/${placeId}`)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="place-detail-wrap">
      <div className="place-detail-header">
        <div className="detail-header-cat">
          {place && <div>{place.cat2Name}</div>}
          {place && <div>{place.cat3Name}</div>}
        </div>

        <div className="detail-header-title">
          {place && <h1 className="detail-title">{place.placeTitle}</h1>}
        </div>
        <div className="detail-header-info">
          <div className="review-score">
            {place && <StarRating rating={place.placeRating} />}
            {place?.placeRating}
            {place?.placeReview && ` (${place.placeReview})`}
            {place && <a> {place.areaName},</a>}
            {place && <a> {place.sigunguName}</a>}
          </div>
          <div className="share-like-box">
            <ShareIcon className="share-icon" />
            <div onClick={handleClick} style={{ cursor: "pointer" }}>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </div>
          </div>
        </div>
      </div>
      <div className="place-detail-image">
        {place && (
          <img
            src={place.placeThumb ? place.placeThumb : "/image/dora.png"}
            className="detail-img1"
          ></img>
        )}
        <div className="detail-img2"></div>
        <div className="detail-img3"></div>
        <div className="detail-img4"></div>
      </div>
      <div className="place-detail-content">
        <div className="main-description">
          <p>
            경복궁은 조선 왕조 제일의 법궁이다. 북으로 북악산을 기대어 자리
            잡았고 정문인 광화문 앞으로는 넓은 육조거리(지금의 세종로)가 펼쳐져,
            왕도인 한양(서울) 도시 계획의 중심이기도 하다. 1395년 태조 이성계가
            창건하였고, 1592년 임진 왜란으로 불타 없어졌다가, 고종 때인 1867년
            중건 되었다. 흥선대원군이 주도한 중건 경복궁은 500여 동의 건물들이
            미로같이 빼곡히 들어선 웅장한 모습 이었다.
          </p>
        </div>
        {(place?.placeAddr || place?.placeTel) && (
          <div className="info-box">
            {place?.placeAddr && (
              <div className="info-item">
                <strong>주소</strong>
                <p>{place.placeAddr}</p>
              </div>
            )}
            {place?.placeTel && (
              <div className="info-item">
                <strong>문의 및 안내</strong>
                <p>{place.placeTel}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="place-detail page-title">
        <h2>리뷰</h2>

        <div
          className="review-write btn-primary green"
          onClick={() => {
            navigate(`/review/write/${placeId}`);
          }}
        >
          글쓰기
        </div>
      </div>
      <div className="place-detail review-wap">
        <div>
          <ul className="posting-wrap">
            {review.map((review, index) => {
              return <ReviewItem key={"review-" + index} review={review} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
const ReviewItem = (props) => {
  const navigate = useNavigate();
  const review = props.review;
  return (
    <li
      className="posting-item"
      onClick={() => {
        navigate(`/review/detail/${review.reviewNo}`);
      }}
    >
      <div className="posting-info">
        <div>
          <StarRating rating={review.starRate} />
        </div>
        <div className="posting-title">{review.reviewTitle}</div>
        <div
          dangerouslySetInnerHTML={{
            __html: review.reviewContent, // p 태그 제거
          }}
        />
        <div className="posting-sub-info">
          <span>{review.memberNickname}</span>
          <span>{review.reviewDate}</span>
        </div>
      </div>
    </li>
  );
};
export default PlaceDetail;
