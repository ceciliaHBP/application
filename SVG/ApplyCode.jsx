import React from 'react';
import Svg, {Path} from 'react-native-svg';

export const ApplyCode = ({color}) => {
  return (
    <Svg
      width="25"
      height="25"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M14.6942 9.19439C14.7617 9.13145 14.8159 9.05555 14.8535 8.97122C14.8911 8.88688 14.9113 8.79585 14.9129 8.70353C14.9145 8.61122 14.8975 8.51953 14.863 8.43392C14.8284 8.34832 14.7769 8.27055 14.7116 8.20527C14.6464 8.13999 14.5686 8.08852 14.483 8.05394C14.3974 8.01937 14.3057 8.00238 14.2134 8.00401C14.1211 8.00564 14.03 8.02585 13.9457 8.06342C13.8614 8.101 13.7855 8.15518 13.7225 8.22272L9.62502 12.3202L8.27752 10.9727C8.14719 10.8513 7.97482 10.7852 7.79671 10.7883C7.6186 10.7915 7.44866 10.8636 7.3227 10.9896C7.19674 11.1155 7.12459 11.2855 7.12145 11.4636C7.1183 11.6417 7.18442 11.8141 7.30586 11.9444L9.13919 13.7777C9.2681 13.9065 9.44283 13.9788 9.62502 13.9788C9.80721 13.9788 9.98195 13.9065 10.1109 13.7777L14.6942 9.19439Z"
        fill={color}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 1.146C5.55779 1.146 1.14587 5.55791 1.14587 11.0002C1.14587 16.4424 5.55779 20.8543 11 20.8543C16.4423 20.8543 20.8542 16.4424 20.8542 11.0002C20.8542 5.55791 16.4423 1.146 11 1.146ZM2.52087 11.0002C2.52087 8.75135 3.41421 6.59464 5.00436 5.00449C6.59452 3.41433 8.75123 2.521 11 2.521C13.2489 2.521 15.4056 3.41433 16.9957 5.00449C18.5859 6.59464 19.4792 8.75135 19.4792 11.0002C19.4792 13.249 18.5859 15.4057 16.9957 16.9958C15.4056 18.586 13.2489 19.4793 11 19.4793C8.75123 19.4793 6.59452 18.586 5.00436 16.9958C3.41421 15.4057 2.52087 13.249 2.52087 11.0002Z"
        fill={color}
      />
    </Svg>
  );
};
