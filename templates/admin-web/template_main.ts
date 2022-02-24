import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_main(fileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);

	return `
  import React, { useMemo, useState } from 'react';
  import { RouteComponentProps } from 'react-router-dom';
  import { Form, Select } from 'antd';
  import ButtonGroup from 'components/buttonGroup';
  import {
    errHandler,
    generalColumnConfig,
  } from 'modules/specialMedicine/common/common';
  import utils from 'utils';
  import {
    queryGroupOrderList,
    requestEnterpriseProjectOrderLog,
    RequestEnterpriseProjectOrderLogInfoIF,
  } from 'modules/specialMedicine/common/request';
  import { ColumnsType } from 'antd/lib/table';
  import SearchFormAndDisplayTable from 'components/searchFormAndDisplayTable';
  import { useAuthenticatedButton } from 'components/authenticatedButton/authenticatedButton';
  import OperationRecord from 'components/operationRecord';
  import { QueryGroupOrderListDataIF } from 'modules/specialMedicine/common/interface';

  const ${upperCasedFileName} = (props: RouteComponentProps) => {
    const {
      history,
      location: { pathname },
    } = props;

    const AuthenticatedButton = useAuthenticatedButton(undefined);

    const [searchForm] = Form.useForm<Record<string, unknown>>();

    const [isOperationRecordModalVisible, setIsOperationRecordModalVisible] = useState<boolean>(false);
    const [operationRecordsList, setOperationRecordsList] = useState<
      RequestEnterpriseProjectOrderLogInfoIF[]
    >([]);

    const groupStatusEnum = useMemo(() => [
      { text: '全部', code: '' },
      { text: '入组资料待审核', code: 'unApprove' },
      { text: '入组审核通过', code: 'pass' },
      { text: '入组审核失败', code: 'refuse' },
    ], []);

    const searchItems = useMemo(() => [
      {
        label: '用药人姓名',
        name: 'patientName',
      },
      {
        label: '入组状态',
        name: 'status',
        children: (
          <Select defaultValue={groupStatusEnum[0].text}>
            {groupStatusEnum.map((item) => {
              return (
                <Select.Option key={item.code} value={item.code}>
                  {item.text}
                </Select.Option>
              );
            })}
          </Select>
        ),
      },
    ], []);

    const tableColumns = useMemo<ColumnsType<>>(() => {
      return [
        { ...generalColumnConfig, title: '订单号', dataIndex: 'groupNo' },
        {
          ...generalColumnConfig,
          title: '创建时间',
          dataIndex: 'applyTime',
          render: (applyTime: number) => utils.fmtSecond(applyTime) || '-',
        },
        {
          ...generalColumnConfig,
          title: '操作',
          render: (id: string, record) => {
            return (
              <ButtonGroup align="center">
                <AuthenticatedButton
                  type="primary"
                  onClick={() => history.push(
                    \`/special-medicine/enterprise-project/\`,
                  )}
                >
                  入组审核
                </AuthenticatedButton>
                <AuthenticatedButton
                  type="primary"
                  onClick={() => handleShowOperationLog(record?.groupNo)}
                >
                  操作日志
                </AuthenticatedButton>
              </ButtonGroup>
            );
          },
        },
      ];
    }, [history]);

    const handleShowOperationLog = async (groupNo: string) => {
      const data = {
        optType: 'EN_GROUP',
        orderNo: groupNo,
      };

      try {
        const response = await requestEnterpriseProjectOrderLog(data);
        setOperationRecordsList(response);
        setIsOperationRecordModalVisible(true);
      } catch (e: any) {
        errHandler(e);
      }
    };

    return (
      <div>
        <SearchFormAndDisplayTable
          authPath={undefined}
          form={searchForm}
          searchItems={searchItems}
          request={queryGroupOrderList}
          tableColumns={tableColumns}
          fixedSearchData={{ productCode: 'VEGARD' }}
        />

        <OperationRecord
          visible={isOperationRecordModalVisible}
          setIsVisible={setIsOperationRecordModalVisible}
          data={operationRecordsList}
        />
      </div>
    );
  };

  export default ${upperCasedFileName} ;

`;
}
