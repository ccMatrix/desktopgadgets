

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 6.00.0366 */
/* at Sat Dec 29 22:48:25 2007
 */
/* Compiler settings for .\RecycleBinDLL.idl:
    Oicf, W1, Zp8, env=Win32 (32b run)
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
//@@MIDL_FILE_HEADING(  )

#pragma warning( disable: 4049 )  /* more than 64k source lines */


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__

#ifndef COM_NO_WINDOWS_H
#include "windows.h"
#include "ole2.h"
#endif /*COM_NO_WINDOWS_H*/

#ifndef __RecycleBinDLL_h__
#define __RecycleBinDLL_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __Irecyclebin_FWD_DEFINED__
#define __Irecyclebin_FWD_DEFINED__
typedef interface Irecyclebin Irecyclebin;
#endif 	/* __Irecyclebin_FWD_DEFINED__ */


#ifndef __recyclebin_FWD_DEFINED__
#define __recyclebin_FWD_DEFINED__

#ifdef __cplusplus
typedef class recyclebin recyclebin;
#else
typedef struct recyclebin recyclebin;
#endif /* __cplusplus */

#endif 	/* __recyclebin_FWD_DEFINED__ */


/* header files for imported files */
#include "oaidl.h"
#include "ocidl.h"

#ifdef __cplusplus
extern "C"{
#endif 

void * __RPC_USER MIDL_user_allocate(size_t);
void __RPC_USER MIDL_user_free( void * ); 

#ifndef __Irecyclebin_INTERFACE_DEFINED__
#define __Irecyclebin_INTERFACE_DEFINED__

/* interface Irecyclebin */
/* [unique][helpstring][nonextensible][dual][uuid][object] */ 


EXTERN_C const IID IID_Irecyclebin;

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("E3CE57EC-F02D-4920-9728-847FF0D1325C")
    Irecyclebin : public IDispatch
    {
    public:
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE binStatus( 
            /* [retval][out] */ USHORT *status) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE openRecycleBin( void) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE emptyBin( void) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE moveToBin( 
            BSTR *filename) = 0;
        
    };
    
#else 	/* C style interface */

    typedef struct IrecyclebinVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            Irecyclebin * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            Irecyclebin * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            Irecyclebin * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            Irecyclebin * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            Irecyclebin * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            Irecyclebin * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            Irecyclebin * This,
            /* [in] */ DISPID dispIdMember,
            /* [in] */ REFIID riid,
            /* [in] */ LCID lcid,
            /* [in] */ WORD wFlags,
            /* [out][in] */ DISPPARAMS *pDispParams,
            /* [out] */ VARIANT *pVarResult,
            /* [out] */ EXCEPINFO *pExcepInfo,
            /* [out] */ UINT *puArgErr);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *binStatus )( 
            Irecyclebin * This,
            /* [retval][out] */ USHORT *status);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *openRecycleBin )( 
            Irecyclebin * This);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *emptyBin )( 
            Irecyclebin * This);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *moveToBin )( 
            Irecyclebin * This,
            BSTR *filename);
        
        END_INTERFACE
    } IrecyclebinVtbl;

    interface Irecyclebin
    {
        CONST_VTBL struct IrecyclebinVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define Irecyclebin_QueryInterface(This,riid,ppvObject)	\
    (This)->lpVtbl -> QueryInterface(This,riid,ppvObject)

#define Irecyclebin_AddRef(This)	\
    (This)->lpVtbl -> AddRef(This)

#define Irecyclebin_Release(This)	\
    (This)->lpVtbl -> Release(This)


#define Irecyclebin_GetTypeInfoCount(This,pctinfo)	\
    (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo)

#define Irecyclebin_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo)

#define Irecyclebin_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)

#define Irecyclebin_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)


#define Irecyclebin_binStatus(This,status)	\
    (This)->lpVtbl -> binStatus(This,status)

#define Irecyclebin_openRecycleBin(This)	\
    (This)->lpVtbl -> openRecycleBin(This)

#define Irecyclebin_emptyBin(This)	\
    (This)->lpVtbl -> emptyBin(This)

#define Irecyclebin_moveToBin(This,filename)	\
    (This)->lpVtbl -> moveToBin(This,filename)

#endif /* COBJMACROS */


#endif 	/* C style interface */



/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE Irecyclebin_binStatus_Proxy( 
    Irecyclebin * This,
    /* [retval][out] */ USHORT *status);


void __RPC_STUB Irecyclebin_binStatus_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE Irecyclebin_openRecycleBin_Proxy( 
    Irecyclebin * This);


void __RPC_STUB Irecyclebin_openRecycleBin_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE Irecyclebin_emptyBin_Proxy( 
    Irecyclebin * This);


void __RPC_STUB Irecyclebin_emptyBin_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE Irecyclebin_moveToBin_Proxy( 
    Irecyclebin * This,
    BSTR *filename);


void __RPC_STUB Irecyclebin_moveToBin_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);



#endif 	/* __Irecyclebin_INTERFACE_DEFINED__ */



#ifndef __RecycleBinDLLLib_LIBRARY_DEFINED__
#define __RecycleBinDLLLib_LIBRARY_DEFINED__

/* library RecycleBinDLLLib */
/* [helpstring][version][uuid] */ 


EXTERN_C const IID LIBID_RecycleBinDLLLib;

EXTERN_C const CLSID CLSID_recyclebin;

#ifdef __cplusplus

class DECLSPEC_UUID("48C125EC-C887-4941-9103-DB6F4A24EC42")
recyclebin;
#endif
#endif /* __RecycleBinDLLLib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

unsigned long             __RPC_USER  BSTR_UserSize(     unsigned long *, unsigned long            , BSTR * ); 
unsigned char * __RPC_USER  BSTR_UserMarshal(  unsigned long *, unsigned char *, BSTR * ); 
unsigned char * __RPC_USER  BSTR_UserUnmarshal(unsigned long *, unsigned char *, BSTR * ); 
void                      __RPC_USER  BSTR_UserFree(     unsigned long *, BSTR * ); 

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


