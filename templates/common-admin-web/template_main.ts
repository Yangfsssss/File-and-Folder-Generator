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

    const searchItems = useMemo<SearchItems<any>>() => [
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
      {
        ...generalColumnConfig,
        title: '创建时间',
        dataIndex: 'applyTime',
        render: (applyTime: number) => utils.fmtSecond(applyTime) || '-',
      },
      {
        label: '注册时间',
        name: 'registerTime',
        children: <DatePicker.RangePicker />,
        format: (registerTime: [moment.Moment, moment.Moment]) => {
          return {
            registerTimeStart: moment(registerTime[0]).format('YYYY-MM-DD'),
            registerTimeEnd: moment(registerTime[1]).format('YYYY-MM-DD'),
          };
        },
      },
    ], []);

    const tableColumns = useMemo<ColumnsType>(() => {
      return [
        {
          ...generalColumnConfig,
          title: '序号',
          render: (_v: void, _r, index) => <span>{index + 1}</span>,
        },
        { ...generalColumnConfig, title: '订单号', dataIndex: 'groupNo' },
        { ...generalColumnConfig, title: '注册时间', dataIndex: 'registerTime', render: (registerTime: number) => utils.fmtSecond(registerTime) },
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
          extraFunctionalButtonsLeft={(
            <ButtonGroup align="center">
              <Button
                onClick={() => {
                  const today = moment().subtract(0, 'days');
  
                  searchForm.setFieldsValue({ registerTime: [today, today] });
                  searchForm.submit();
                }}
              >
                当日
              </Button>
              <Button
                onClick={() => {
                  const threeDays = moment().subtract(3, 'days');
                  const today = moment().subtract(0, 'days');
  
                  searchForm.setFieldsValue({ registerTime: [threeDays, today] });
                  searchForm.submit();
                }}
              >
                近三天
              </Button>
              <Button
                onClick={() => {
                  const tenDays = moment().subtract(10, 'days');
                  const today = moment().subtract(0, 'days');
  
                  searchForm.setFieldsValue({ registerTime: [tenDays, today] });
                  searchForm.submit();
                }}
              >
                近十天
              </Button>
              <Upload
                accept={excelMIMEType}
                data-type="insureBatchReduce"
                onSelect={importExcelOfCreatingUserAccountsAndDownloadImportResult}
              >
                <Button
                  type="primary"
                  loading={importLoading}
                >
                  批量创建账号
                </Button>
              </Upload>
            </ButtonGroup>
          )}
          fixedSearchData={{ productCode: 'VEGARD' }}
        />

        <ModalForm
        width={600}
        title={\`'\${operationType === 'add' ? '添加' : '编辑'}话题'\`}
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        maskClosable={false}
        formRef={topicForm}
        formItems={[
          {
            label: '话题分类',
            name: 'subjectCategoryNo',
            span: 24,
            children: (
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
              >
                {allTopicSortRelatedDiseaseAndAccountEnum?.topicSort?.map((item) => {
                  return (
                    <Select.Option key={item.code} value={item.code}>
                      {item.text}
                    </Select.Option>
                  );
                })}
              </Select>
            ),
            rules: [
              { required: true },
              {
                validator: (rule, value) => {
                  if (value?.length > 50) {
                    return Promise.reject('不能超过50个字符');
                  }
                  return Promise.resolve();
                },
              },
            ],
          },
          {
            label: '话题名称',
            name: 'name',
            span: 24,
            children: <Input placeholder="名称最多20个中文字符" />,
            rules: [{ required: true, max: 20 }],
          },
          {
            label: '话题简介',
            name: 'introduce',
            span: 24,
            children: <Input.TextArea placeholder="名称最多100个中文字符" />,
            rules: [{ required: true, max: 100 }],
          },
        ]}
        extraFormData={{
          subjectNo: currentSelectedTopicNo,
        }}
        request={handleAddOrUpdateTopic}
        cbs={[refresh]}
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
